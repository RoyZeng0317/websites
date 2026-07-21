import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { Resend } from 'resend'

const {
  FIREBASE_SERVICE_ACCOUNT_JSON,
  RESEND_API_KEY,
  RESEND_FROM = 'onboarding@resend.dev',
  RELEASE_VERSION = 'unknown',
  RELEASE_NOTE = '',
  SITE_URL = 'https://stocks-global.web.app',
} = process.env

if (!FIREBASE_SERVICE_ACCOUNT_JSON || !RESEND_API_KEY) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT_JSON or RESEND_API_KEY env var.')
  process.exit(1)
}

initializeApp({ credential: cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON)) })
const resend = new Resend(RESEND_API_KEY)

async function listActiveUserEmails() {
  const emails = new Set()
  let pageToken
  do {
    const page = await getAuth().listUsers(1000, pageToken)
    for (const user of page.users) {
      if (user.email && !user.disabled) emails.add(user.email)
    }
    pageToken = page.pageToken
  } while (pageToken)
  return [...emails]
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

function buildHtml() {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;line-height:1.6">
      <h2>Stock Info 有新版本上線了</h2>
      <p>版本：<code>${escapeHtml(RELEASE_VERSION)}</code></p>
      ${RELEASE_NOTE ? `<p>更新內容：${escapeHtml(RELEASE_NOTE)}</p>` : ''}
      <p><a href="${SITE_URL}">前往查看 →</a></p>
    </div>
  `.trim()
}

async function main() {
  const emails = await listActiveUserEmails()
  console.log(`Found ${emails.length} user(s) to notify.`)
  if (emails.length === 0) return

  const html = buildHtml()
  const subject = `Stock Info 新版本上線通知 (${RELEASE_VERSION})`

  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100).map((to) => ({ from: RESEND_FROM, to, subject, html }))
    const { error } = await resend.batch.send(batch)
    if (error) {
      console.error('Resend batch error:', error)
      process.exitCode = 1
    }
  }
  console.log('Notification emails sent.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
