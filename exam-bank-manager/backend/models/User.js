const { pool } = require('../config/db');

class User {
  static async findByFirebaseUid(firebaseUid) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE firebase_uid = ?',
      [firebaseUid]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async create({ firebaseUid, email, displayName }) {
    const [result] = await pool.execute(
      'INSERT INTO users (firebase_uid, email, display_name) VALUES (?, ?, ?)',
      [firebaseUid, email, displayName || email.split('@')[0]]
    );
    return this.findById(result.insertId);
  }

  static async update(id, { displayName, avatarUrl }) {
    const fields = [];
    const values = [];
    if (displayName !== undefined) {
      fields.push('display_name = ?');
      values.push(displayName);
    }
    if (avatarUrl !== undefined) {
      fields.push('avatar_url = ?');
      values.push(avatarUrl);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }
}

module.exports = User;
