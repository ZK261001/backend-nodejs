const { verifyEmailSecret } = require("@/config/jwt");
const transporter = require("@/config/nodemailer");
const jwt = require("jsonwebtoken");
const sleep = require("@/utils/sleep.js");

class EmailService {
    async sendVerifyEmail(user, retryCount = 0) {
        try {
            const token = jwt.sign(
                {
                    sub: user.id,
                    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
                },
                verifyEmailSecret,
            );

            const info = await transporter.sendMail({
                from: '"Daily-Korean" <luuthehuy2610@gmail.com>', // sender address
                to: user.email,
                subject: "Xác thực tài khoản",
                html: `<b><a href="http://localhost:5173?token=${token}">Click here</a></b>`,
            });
            return info;
        } catch (error) {
            console.error(
                `sendVerifyEmail failed (attempt ${retryCount + 1}):`,
                error,
            );

            if (retryCount < 3) {
                await sleep(2000);
                return this.sendVerifyEmail(user, retryCount + 1);
            }

            throw error;
        }
    }
}

module.exports = new EmailService();
