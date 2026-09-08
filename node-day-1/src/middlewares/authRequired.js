const jwt = require("jsonwebtoken");
const { authSecret } = require("@/config/jwt");
const userModel = require("@/models/user.model");

const authRequired = async (req, res, next) => {
    const access_token = req.headers.authorization
        ?.replace("Bearer", "")
        .trim();

    const payload = jwt.verify(access_token, authSecret);

    // Check exp
    if (payload.exp * 1000 < Date.now()) {
        return res.error("Access token expired", 401);
    }

    // Get user
    const currentUser = await userModel.findOne(payload.sub);

    req.user = currentUser;

    next();
};

module.exports = authRequired;
