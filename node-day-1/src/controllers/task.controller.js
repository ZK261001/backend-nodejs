const taskModel = require("../models/task.model");

const getAll = (req, res) => {
    const tasks = taskModel.findAll();
    res.success(tasks, 201);
};

const getOne = (req, res) => {
    const task = taskModel.findOne(+req.params.id);

    if (!task) {
        return res.error({ message: "Task not found" }, 404);
    }

    res.success(task);
};

const create = (req, res) => {
    const newTask = taskModel.create({
        title: req.body.title,
    });
    res.success(newTask, 201);
};

const toggle = (req, res) => {
    res.json("Toggle task isCompleted");
};

module.exports = { getAll, getOne, create, toggle };
