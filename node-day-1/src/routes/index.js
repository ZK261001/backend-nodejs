const express = require("express");

const usersRouter = require("./users.route");
const postsRouter = require("./posts.route");
const tasksRouter = require("./tasks.route");

const router = express.Router();

router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/tasks", tasksRouter);

module.exports = router;
