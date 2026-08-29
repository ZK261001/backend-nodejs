const postModel = require("@/models/post.model");
const postService = require("@/services/post.service");

// Service layer

const getAll = async (req, res) => {
    const page = +req.query.page || 1;
    const result = await postService.pagination(page, 20, {
        user_id: req.query.user_id,
    });

    res.paginate(result);
};

const getOne = async (req, res) => {
    const task = await postModel.findOne(req.params.id);

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
    const newPost = await postModel.create({
        title,
        slug,
        description,
        content,
    });
    res.success(newPost, 201);
};

const destroy = async (req, res) => {
    const deleted = await postModel.destroy(req.params.id);

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
