// Service layer
const jwt = require("jsonwebtoken");
const userModel = require("@/models/user.model");
const { secret } = require("@/config/jwt");
const bcrypt = require("bcrypt");
const strings = require("@/utils/strings");
const saltRounds = 10;

const register = async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);

    const insertId = await userModel.create(email, hash);

    const newUser = {
        id: insertId,
        email,
    };

    res.success(newUser, 201);
};

const responseWithToken = async (user) => {
    const payload = {
        sub: user.id,
        exp: Math.floor(Date.now() / 1000) + 60,
    };

    const accessToken = jwt.sign(payload, secret);
    const refreshToken = strings.createRandomString(32);
    const refreshTtl = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);

    await userModel.updateRefreshToken(user.id, refreshToken, refreshTtl);

    const response = {
        access_token: accessToken,
        access_token_ttl: 10,
        refresh_token: refreshToken,
        refresh_token_ttl: 60 * 60 * 24 * 30,
    };

    return response;
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);

    if (!user) {
        return res.error("Unauthorized", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.error("Unauthorized", 401);
    }

    const tokens = await responseWithToken(user);
    res.success(user, 200, tokens);
};

const getCurrentUser = async (req, res) => {
    res.success(req.user);
};

const refreshToken = async (req, res) => {
    const refreshToken = req.body.refresh_token;
    const user = await userModel.findByRefreshToken(refreshToken);

    if (!user) {
        return res.error("Unauthorized", 401);
    }

    const tokens = await responseWithToken(user);
    res.success(tokens, 200);
};

module.exports = { register, login, getCurrentUser, refreshToken };
