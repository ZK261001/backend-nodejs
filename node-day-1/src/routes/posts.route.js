const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");

router.get("/", postController.getAll);
router.get("/:id", postController.getOne);
router.post("/", postController.create);
router.delete("/:id", postController.destroy);

module.exports = router;
