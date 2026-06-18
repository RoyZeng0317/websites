require('dotenv').config()
const express = require('express')
const admin = require('firebase-admin')
const path = require('path')

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!keyPath) {
  console.error('❌ 未設定 GOOGLE_APPLICATION_CREDENTIALS 環境變數')
  console.error('   請在 .env 檔案中加入：GOOGLE_APPLICATION_CREDENTIALS=金鑰路徑')
  process.exit(1)
}
let serviceAccount
try {
  serviceAccount = JSON.parse(require('fs').readFileSync(keyPath, 'utf8'))
} catch {
  console.error(`❌ 讀取 Service Account Key 失敗：${keyPath}`)
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'velix-socialize',
})

const db = admin.firestore()
const auth = admin.auth()
const app = express()

function toMs(v) {
  if (!v) return null
  if (typeof v.toMillis === 'function') return v.toMillis()
  if (typeof v === 'number') return v
  return null
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

async function cleanupExpiredVerifications() {
  try {
    const snap = await db.collection('verifications').where('status', '==', 'approved').get()
    const now = Date.now()
    const expired = snap.docs.filter(d => {
      const t = toMs(d.data().reviewedAt)
      return t && (now - t) >= THREE_DAYS_MS
    })
    if (expired.length > 0) {
      await Promise.all(expired.map(d => d.ref.delete()))
      console.log(`[Cleanup] 已刪除 ${expired.length} 筆過期驗證紀錄`)
    }
  } catch (e) {
    console.error('[Cleanup] 清理失敗:', e.message)
  }
}

cleanupExpiredVerifications()
setInterval(cleanupExpiredVerifications, 12 * 60 * 60 * 1000)

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// ── 統計 ─────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [pending, approved, rejected, users, suspended] = await Promise.all([
      db.collection('verifications').where('status', '==', 'pending').count().get(),
      db.collection('verifications').where('status', '==', 'approved').count().get(),
      db.collection('verifications').where('status', '==', 'rejected').count().get(),
      db.collection('users').count().get(),
      db.collection('users').where('isSuspended', '==', true).count().get(),
    ])
    res.json({
      pending: pending.data().count,
      approved: approved.data().count,
      rejected: rejected.data().count,
      totalUsers: users.data().count,
      suspended: suspended.data().count,
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 驗證列表 ─────────────────────────────────────────────
app.get('/api/verifications', async (req, res) => {
  try {
    const status = req.query.status || 'pending'
    let q = db.collection('verifications')
    if (status !== 'all') q = q.where('status', '==', status)
    const snap = await q.get()

    const results = await Promise.all(snap.docs.map(async docSnap => {
      const data = docSnap.data()
      const [userDoc, authUser] = await Promise.all([
        db.collection('users').doc(docSnap.id).get(),
        auth.getUser(docSnap.id).catch(() => null),
      ])
      const user = userDoc.exists ? userDoc.data() : {}
      const provider = authUser?.providerData?.[0]?.providerId || 'unknown'
      const email = authUser?.email || authUser?.providerData?.[0]?.email || user.email || ''
      return {
        uid: docSnap.id,
        ...data,
        submittedAt: toMs(data.submittedAt),
        reviewedAt: toMs(data.reviewedAt),
        user,
        provider,
        email,
      }
    }))

    results.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0))
    res.json(results)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 核准 ─────────────────────────────────────────────────
app.post('/api/verifications/:uid/approve', async (req, res) => {
  try {
    const { uid } = req.params
    await Promise.all([
      db.collection('verifications').doc(uid).update({ status: 'approved', reviewedAt: Date.now(), rejectReason: null }),
      db.collection('users').doc(uid).update({ verificationStatus: 'verified' }),
      db.collection('users').doc(uid).collection('notifications').add({
        toUserId: uid,
        fromUserId: 'system',
        fromUserName: 'Velix 官方',
        fromUserPhoto: '',
        type: 'verified',
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    ])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 拒絕 ─────────────────────────────────────────────────
app.post('/api/verifications/:uid/reject', async (req, res) => {
  try {
    const { uid } = req.params
    const { reason } = req.body
    await Promise.all([
      db.collection('verifications').doc(uid).update({ status: 'rejected', reviewedAt: Date.now(), rejectReason: reason || '文件不符合要求' }),
      db.collection('users').doc(uid).update({ verificationStatus: 'rejected' }),
    ])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 用戶列表 ─────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const [userSnap, verifSnap] = await Promise.all([
      db.collection('users').orderBy('createdAt', 'desc').get(),
      db.collection('verifications').get(),
    ])
    const verifMap = {}
    verifSnap.docs.forEach(d => { verifMap[d.id] = d.data() })

    const users = await Promise.all(userSnap.docs.map(async d => {
      const data = d.data()
      const authUser = await auth.getUser(d.id).catch(() => null)
      const provider = authUser?.providerData?.[0]?.providerId || 'unknown'
      const email = authUser?.email || authUser?.providerData?.[0]?.email || ''
      const verif = verifMap[d.id] || null
      return {
        uid: d.id,
        ...data,
        createdAt: toMs(data.createdAt),
        suspendedAt: toMs(data.suspendedAt),
        provider,
        email,
        verificationRequest: verif ? {
          status: verif.status,
          submittedAt: toMs(verif.submittedAt),
          idImageUrl: verif.idImageUrl || null,
        } : null,
      }
    }))
    res.json(users)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 新增違規點數 ──────────────────────────────────────────
app.post('/api/users/:uid/violation', async (req, res) => {
  try {
    const { uid } = req.params
    const { points, reason } = req.body
    if (!points || points < 1) return res.status(400).json({ error: '點數無效' })

    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()
    if (!userDoc.exists) return res.status(404).json({ error: '用戶不存在' })

    const current = userDoc.data().violationPoints || 0
    const newTotal = current + points
    const isSuspended = newTotal >= 10

    await userRef.update({
      violationPoints: newTotal,
      isSuspended,
      ...(isSuspended ? { suspendedAt: Date.now(), suspendReason: reason || '違規點數達上限' } : {}),
    })

    // 記錄違規紀錄
    await db.collection('users').doc(uid).collection('violations').add({
      points,
      reason: reason || '',
      addedAt: Date.now(),
      totalAfter: newTotal,
    })

    res.json({ ok: true, newTotal, isSuspended })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 解除停權 / 清除點數 ───────────────────────────────────
app.post('/api/users/:uid/unsuspend', async (req, res) => {
  try {
    const { uid } = req.params
    const { resetPoints } = req.body
    const update = { isSuspended: false, suspendedAt: null, suspendReason: null }
    if (resetPoints) update.violationPoints = 0
    await db.collection('users').doc(uid).update(update)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 刪除帳戶（Firestore + Auth）──────────────────────────────
app.delete('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params

    // 刪除子集合：violations
    const violSnap = await db.collection('users').doc(uid).collection('violations').get()
    const batch = db.batch()
    violSnap.docs.forEach(d => batch.delete(d.ref))
    if (!violSnap.empty) await batch.commit()

    // 刪除主要 Firestore 文件
    await Promise.all([
      db.collection('users').doc(uid).delete(),
      db.collection('verifications').doc(uid).delete().catch(() => {}),
    ])

    // 刪除 Firebase Auth 帳戶
    await auth.deleteUser(uid)

    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 重置（讓使用者重新提交）────────────────────────────────
app.delete('/api/verifications/:uid', async (req, res) => {
  try {
    const { uid } = req.params
    await Promise.all([
      db.collection('verifications').doc(uid).delete(),
      db.collection('users').doc(uid).update({ verificationStatus: admin.firestore.FieldValue.delete() }),
    ])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 廣播訊息 ──────────────────────────────────────────────
app.post('/api/broadcast', async (req, res) => {
  try {
    const { content, imageUrl, videoUrl, linkUrl } = req.body
    if (!content?.trim()) return res.status(400).json({ error: '內容不得為空' })

    const now = admin.firestore.FieldValue.serverTimestamp()
    const hashtags = (content.match(/#[\w一-鿿]+/g) || []).map(t => t.slice(1).toLowerCase())

    const postData = {
      authorId: 'system',
      authorName: 'Velix 官方',
      authorUsername: 'velix_official',
      authorPhotoUrl: '/icon.png',
      content: content.trim(),
      hashtags,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      repostsCount: 0,
      createdAt: now,
    }
    if (imageUrl?.trim()) postData.imageUrl = imageUrl.trim()
    if (videoUrl?.trim()) postData.videoUrl = videoUrl.trim()
    if (linkUrl?.trim()) postData.linkUrl = linkUrl.trim()

    const postRef = await db.collection('posts').add(postData)

    // 通知所有用戶（Firestore batch 上限 499）
    const usersSnap = await db.collection('users').get()
    const CHUNK = 499
    const docs = usersSnap.docs
    for (let i = 0; i < docs.length; i += CHUNK) {
      const chunk = docs.slice(i, i + CHUNK)
      const batch = db.batch()
      chunk.forEach(userDoc => {
        const notifRef = db.collection('users').doc(userDoc.id).collection('notifications').doc()
        batch.set(notifRef, {
          toUserId: userDoc.id,
          fromUserId: 'system',
          fromUserName: 'Velix 官方',
          fromUserPhoto: '/icon.png',
          type: 'announcement',
          postId: postRef.id,
          postContent: content.trim().slice(0, 80),
          isRead: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })
      })
      await batch.commit()
    }

    res.json({ ok: true, postId: postRef.id, notified: docs.length })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 廣播列表 ──────────────────────────────────────────────
app.get('/api/broadcasts', async (req, res) => {
  try {
    const snap = await db.collection('posts').where('authorId', '==', 'system').get()
    const posts = snap.docs.map(d => ({
      id: d.id,
      content: d.data().content,
      imageUrl: d.data().imageUrl || null,
      videoUrl: d.data().videoUrl || null,
      linkUrl: d.data().linkUrl || null,
      createdAt: toMs(d.data().createdAt),
    }))
    posts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    res.json(posts)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── 刪除廣播（含所有用戶通知）────────────────────────────
app.delete('/api/broadcasts/:postId', async (req, res) => {
  try {
    const { postId } = req.params

    // 平行查詢每位用戶的 notifications 子集合，找出關聯通知
    const usersSnap = await db.collection('users').get()
    const USER_BATCH = 50
    const allNotifDocs = []

    for (let i = 0; i < usersSnap.docs.length; i += USER_BATCH) {
      const chunk = usersSnap.docs.slice(i, i + USER_BATCH)
      const results = await Promise.all(
        chunk.map(u =>
          db.collection('users').doc(u.id).collection('notifications')
            .where('postId', '==', postId)
            .get()
        )
      )
      results.forEach(snap => allNotifDocs.push(...snap.docs))
    }

    // 批次刪除通知（Firestore batch 上限 499）
    const CHUNK = 499
    for (let i = 0; i < allNotifDocs.length; i += CHUNK) {
      const batch = db.batch()
      allNotifDocs.slice(i, i + CHUNK).forEach(d => batch.delete(d.ref))
      await batch.commit()
    }

    // 刪除貼文本體
    await db.collection('posts').doc(postId).delete()

    res.json({ ok: true, deletedNotifications: allNotifDocs.length })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`\n✅ Velix Admin 已啟動`)
  console.log(`   → http://localhost:${PORT}\n`)
})
