const { verifyEmailSecret } = require("@/config/jwt");
const transporter = require("@/config/nodemailer");
const jwt = require("jsonwebtoken");

class EmailService {
    async sendVerifyEmail(user) {
        let _retryCount = 0;
        const token = jwt.sign(
            {
                sub: user.id,
                exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
            },
            verifyEmailSecret,
        );

        try {
            const info = await transporter.sendMail({
                from: '"Daily-Korean" <luuthehuy2610@gmail.com>', // sender address
                to: user.email,
                subject: "Xác thực tài khoản",
                html: `<b><a href="http://localhost:5173?token=${token}">Click here</a></b>`,
            });
            return info;
        } catch (error) {
            if (!this._retryCount >= 3) {
                sleep(2000);
                this._retryCount++;
                this.sendVerifyEmail(user);
            }
        }
    }
}

module.exports = new EmailService();
