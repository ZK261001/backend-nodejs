const pool = require("@/config/database");

class Post {
    async findAll(limit, offset, condition = {}) {
        const filters = Object.entries(condition).filter(
            ([, value]) => value !== undefined && value !== null,
        );

        const whereClause = filters.length
            ? `WHERE ${filters.map(([key]) => `${key} = ?`).join(" AND ")}`
            : "";
        const params = filters.map(([, value]) => value);

        const [rows] = await pool.query(
            `SELECT * FROM posts ${whereClause} LIMIT ? OFFSET ?`,
            [...params, limit, offset],
        );

        return rows;
    }

    async count() {
        const [rows] = await pool.query(`SELECT COUNT(*) as count FROM posts`);
        return rows[0].count;
    }

    async findOne(id) {
        const [rows] = await pool.query(`SELECT * FROM posts WHERE id = ${id}`);
        return rows[0];
    }

    async create(data) {
        const { title, slug, description, content = null } = data;
        const [result] = await pool.query(
            "INSERT INTO posts (title, slug, description, content) VALUES (?, ?, ?, ?)",
            [title, slug, description, content],
        );
        return this.findOne(result.insertId);
    }

    async destroy(id) {
        const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [
            id,
        ]);
        return result.affectedRows > 0;
    }
}

module.exports = new Post();
