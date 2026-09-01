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
            `SELECT id, email, first_name, last_name, created_at FROM users WHERE id = ${id}`,
        );
        return rows[0];
    }

    async findByEmailAndPassword(email, password) {
        const [rows] = await pool.query(
            `SELECT id, email, first_name, last_name FROM users WHERE email = ? and password = ?`,
            [email, password],
        );
        return rows[0];
    }

    async create(email, password) {
        const [{ insertId }] = await pool.query(
            `insert into users (email, password) values ("${email}", "${password}")`,
        );

        return insertId;
    }
}

module.exports = new User();
