const pool = require("@/config/database");

class User {
    async findAll(limit, offset) {
        const [rows] = await pool.query(
            `SELECT * FROM users limit ${limit} offset ${offset} `,
        );
        return rows;
    }

    async count() {
        const [rows] = await pool.query(`SELECT COUNT(*) as count FROM users`);
        return rows[0].count;
    }

    async findOne(id) {
        const [rows] = await pool.query(
            `SELECT id, email, first_name, last_name, verified_at, created_at  FROM users WHERE id = ${id}`,
        );
        return rows[0];
    }

    async findByEmail(email) {
        const [rows] = await pool.query(
            `SELECT id, email, first_name, last_name, password, verified_at FROM users WHERE email = ?`,
            [email],
        );
        return rows[0];
    }

    async create(email, password) {
        const [{ insertId }] = await pool.query(
            `insert into users (email, password) values ("${email}", "${password}")`,
        );

        return insertId;
    }

    async updateRefreshToken(id, token, ttl) {
        const [{ affectedRows }] = await pool.query(
            `update users set refresh_token = ?, refresh_expires_at = ? where id = ?`,
            [token, ttl, id],
        );

        return affectedRows;
    }

    async verifyEmail(id) {
        const [{ affectedRows }] = await pool.query(
            `update users set verified_at = now() where id = ?`,
            [id],
        );

        return affectedRows;
    }

    async findByRefreshToken(token) {
        const [rows] = await pool.query(
            `SELECT * FROM users where refresh_token = ? and refresh_expires_at >= now()`,
            [token],
        );
        return rows[0];
    }
}

module.exports = new User();
