const taskCreateValidator = (req, res, next) => {
    const { title } = req.body;
    if (
        typeof title !== "string" ||
        title.trim().length < 2 ||
        title.trim().length > 50
    ) {
        return res.error(
            {
                title: "Title must be in 2 to 50",
            },
            422,
        );
    }
    next();
};

module.exports = taskCreateValidator;
