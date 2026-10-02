const userModel = require("@/models/user.model");
const emailService = require("@/services/email.service");

async function dailyReport() {
    const userCount = await userModel.countNewUser();

    const date = new Date();
    date.setDate(date.getDate() - 1);
    const prev = date.toISOString().slice(0, 10);
    await emailService.sendReportEmail(
        "luuthehuy2610@gmail.com",
        `Daily report ${prev}`,
        userCount,
    );
}

module.exports = dailyReport;
