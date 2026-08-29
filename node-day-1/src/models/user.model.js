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
        const [rows] = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
        return rows[0];
    }
}

module.exports = new User();
