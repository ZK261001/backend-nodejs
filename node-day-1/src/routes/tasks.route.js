const express = require("express");
const router = express.Router();

const taskController = require("../controllers/task.controller");
const taskCreateValidator = require("../middlewares/taskCreateValidator");

router.get("/", taskController.getAll);
router.get("/:id", taskController.getOne);
router.post("/", taskCreateValidator, taskController.create);
router.patch("/:id/toggle", taskController.toggle);

module.exports = router;
