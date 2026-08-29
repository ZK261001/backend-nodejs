const userModel = require("@/models/user.model");
const userService = require("@/services/user.service");

// Service layer

const getAll = async (req, res) => {
    const page = +req.query.page || 1;
    const result = await userService.pagination(page);

    res.paginate(result);
};

const getOne = async (req, res) => {
    const task = await userModel.findOne(req.params.id);

    if (!task) {
        res.error(
            {
                message: `Resource not found: ${req.params.id}`,
            },
            404,
        );
        return;
    }
    res.success(task);
};

const create = async (req, res) => {
    const { title, slug, description, content } = req.body;
    const newUser = await userModel.create({
        title,
        slug,
        description,
        content,
    });
    res.success(newUser, 201);
};

const destroy = async (req, res) => {
    const deleted = await userModel.destroy(req.params.id);

    if (!deleted) {
        res.error(
            {
                message: `Resource not found: ${req.params.id}`,
            },
            404,
        );
        return;
    }
    res.success("Delete success");
};

module.exports = { getAll, getOne, create, destroy };
