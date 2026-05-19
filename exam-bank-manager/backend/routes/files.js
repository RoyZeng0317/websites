const express = require('express');
const router = express.Router();
const FileModel = require('../models/File');
const { authenticate } = require('../middleware/auth');
const { db, adminInitialized } = require('../config/firebase');
const { pool } = require('../config/db');

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const { page, limit, subject, status } = req.query;
    const result = await FileModel.findByUserId(req.user.id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      subject,
      status
    });
    res.json(result);
  } catch (error) {
    console.error('取得檔案列表失敗:', error);
    res.status(500).json({ error: '取得檔案列表失敗' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: '檔案不存在' });
    }
    if (file.user_id !== req.user.id) {
      return res.status(403).json({ error: '無權限存取此檔案' });
    }

    let questions = null;
    if (file.firestore_doc_id && db) {
      try {
        const doc = await db.collection('questionBanks').doc(file.firestore_doc_id).get();
        if (doc.exists) {
          questions = doc.data().questions || [];
        }
      } catch (e) {
        console.warn('Firestore 讀取失敗，降級使用本地儲存:', e.message);
        questions = file._questions ? JSON.parse(file._questions) : [];
      }
    } else if (file._questions) {
      questions = JSON.parse(file._questions);
    }

    res.json({ file, questions });
  } catch (error) {
    console.error('取得檔案失敗:', error);
    res.status(500).json({ error: '取得檔案失敗' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { filename, description, subject, grade, fileType, questions } = req.body;
    if (!filename) {
      return res.status(400).json({ error: '檔案名稱為必填' });
    }

    let firestoreDocId = null;
    let questionsJson = null;

    if (questions && Array.isArray(questions)) {
      if (db) {
        try {
          const docRef = await db.collection('questionBanks').add({
            userId: req.user.id,
            filename,
            questions,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          firestoreDocId = docRef.id;
        } catch (e) {
          console.warn('Firestore 寫入失敗，降級使用本地儲存:', e.message);
          questionsJson = JSON.stringify(questions);
        }
      } else {
        questionsJson = JSON.stringify(questions);
      }
    }

    const fileId = await FileModel.create({
      userId: req.user.id,
      filename,
      description,
      subject,
      grade,
      fileType: fileType || 'mixed',
      firestoreDocId,
      totalQuestions: questions ? questions.length : 0
    });

    if (questionsJson) {
      await pool.execute(
        'UPDATE files SET _questions = ? WHERE id = ?',
        [questionsJson, fileId.id]
      );
      fileId._questions = questionsJson;
    }

    res.status(201).json({ file: fileId });
  } catch (error) {
    console.error('建立檔案失敗:', error);
    res.status(500).json({ error: '建立檔案失敗' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: '檔案不存在' });
    }
    if (file.user_id !== req.user.id) {
      return res.status(403).json({ error: '無權限修改此檔案' });
    }

    const { filename, description, subject, grade, fileType, status, questions } = req.body;

    if (questions && Array.isArray(questions)) {
      if (file.firestore_doc_id && db) {
        try {
          await db.collection('questionBanks').doc(file.firestore_doc_id).update({
            questions,
            filename: filename || file.filename,
            updatedAt: new Date().toISOString()
          });
        } catch (e) {
          console.warn('Firestore 更新失敗，降級使用本地儲存:', e.message);
          await pool.execute('UPDATE files SET _questions = ? WHERE id = ?', [JSON.stringify(questions), req.params.id]);
        }
      } else if (db && !file.firestore_doc_id) {
        try {
          const docRef = await db.collection('questionBanks').add({
            userId: req.user.id,
            filename: filename || file.filename,
            questions,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          await pool.execute('UPDATE files SET firestore_doc_id = ? WHERE id = ?', [docRef.id, req.params.id]);
        } catch (e) {
          await pool.execute('UPDATE files SET _questions = ? WHERE id = ?', [JSON.stringify(questions), req.params.id]);
        }
      } else {
        await pool.execute('UPDATE files SET _questions = ? WHERE id = ?', [JSON.stringify(questions), req.params.id]);
      }
    }

    const updated = await FileModel.update(req.params.id, {
      filename, description, subject, grade,
      file_type: fileType, status,
      total_questions: questions ? questions.length : undefined
    });

    res.json({ file: updated });
  } catch (error) {
    console.error('更新檔案失敗:', error);
    res.status(500).json({ error: '更新檔案失敗' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: '檔案不存在' });
    }
    if (file.user_id !== req.user.id) {
      return res.status(403).json({ error: '無權限刪除此檔案' });
    }

    if (file.firestore_doc_id && db) {
      try {
        await db.collection('questionBanks').doc(file.firestore_doc_id).delete();
      } catch (e) {
        console.warn('Firestore 刪除失敗:', e.message);
      }
    }

    const deleted = await FileModel.delete(req.params.id);
    res.json({ success: deleted, message: '檔案已刪除' });
  } catch (error) {
    console.error('刪除檔案失敗:', error);
    res.status(500).json({ error: '刪除檔案失敗' });
  }
});

module.exports = router;
