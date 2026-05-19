const { pool } = require('../config/db');

class FileModel {
  static async findByUserId(userId, { page = 1, limit = 20, subject, status } = {}) {
    let sql = 'SELECT * FROM files WHERE user_id = ?';
    const params = [userId];

    if (subject) {
      sql += ' AND subject = ?';
      params.push(subject);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countRows] = await pool.execute(countSql, params);
    const total = countRows[0].total;

    const offset = (page - 1) * limit;
    sql += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute(sql, params);
    return { files: rows, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM files WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async create({ userId, filename, description, subject, grade, fileType, firestoreDocId }) {
    const [result] = await pool.execute(
      `INSERT INTO files (user_id, filename, description, subject, grade, file_type, firestore_doc_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, filename, description || null, subject || null, grade || null, fileType || 'mixed', firestoreDocId || null]
    );
    return this.findById(result.insertId);
  }

  static async update(id, fields) {
    const allowed = ['filename', 'description', 'subject', 'grade', 'file_type', 'status', 'total_questions', 'tags'];
    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
      if (allowed.includes(key)) {
        setClauses.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (setClauses.length === 0) return this.findById(id);

    values.push(id);
    await pool.execute(
      `UPDATE files SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM files WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = FileModel;
