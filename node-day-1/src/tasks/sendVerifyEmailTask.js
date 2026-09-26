const emailService = require("@/services/email.service");

async function sendVerifyEmail(payload) {
    await emailService.sendVerifyEmail(payload);
}

module.exports = sendVerifyEmail;
