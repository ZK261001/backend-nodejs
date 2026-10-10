function customResponse(req, res, next) {
    res.success = (data, status = 200) => {
        res.status(status).json({
            data: data,
        });
    };
    next();
}

module.exports = customResponse;
