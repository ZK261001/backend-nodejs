// Service layer
const jwt = require("jsonwebtoken");
const userModel = require("@/models/user.model");
const { authSecret, verifyEmailSecret } = require("@/config/jwt");
const bcrypt = require("bcrypt");
const strings = require("@/utils/strings");
const { HTTP_STATUS } = require("@/config/constants");
const emailService = require("@/services/email.service");
const saltRounds = 10;

const register = async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);

    try {
        const insertId = await userModel.create(email, hash);

        const newUser = {
            id: insertId,
            email,
        };

        // Send verified email
        await emailService.sendVerifyEmail(newUser);

        res.success(newUser, 201);
    } catch (error) {
        if (String(error).includes("Duplicate")) {
            res.error("tài khoản đã tồn tại", HTTP_STATUS.CONFLICT);
        } else {
            throw error;
        }
    }
};

const responseWithToken = async (user) => {
    const payload = {
        sub: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 5,
    };

    const accessToken = jwt.sign(payload, authSecret);
    const refreshToken = strings.createRandomString(32);
    const refreshTtl = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);

    await userModel.updateRefreshToken(user.id, refreshToken, refreshTtl);

    const response = {
        access_token: accessToken,
        access_token_ttl: 5,
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

const verifyEmail = async (req, res) => {
    const token = req.body.token;
    const payload = jwt.verify(token, verifyEmailSecret);

    // exp được ký theo giây, nên so sánh cũng phải quy về giây
    if (payload.exp < Math.floor(Date.now() / 1000)) {
        return res.error("Token het han");
    }

    const userId = payload.sub;
    const user = await userModel.findOne(userId);

    if (user.verified_at) {
        return res.error("Token da het han hoac khong hop le", 403);
    }

    await userModel.verifyEmail(userId);

    res.success("verify email thanh cong");
};

const resendVerifyEmail = async (req, res) => {
    if (req.user.verified_at) {
        res.error("Tai khoan da duoc xac minh", 400);
    }
    emailService.sendVerifyEmail(req.user);
    res.success("Resend verify email success");
};

module.exports = {
    register,
    login,
    getCurrentUser,
    refreshToken,
    verifyEmail,
    resendVerifyEmail,
};
