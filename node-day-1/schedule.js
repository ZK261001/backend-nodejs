require("dotenv").config();
require("module-alias/register");
require("@/config/database");

const { CronJob } = require("cron");

const dailyReport = require("@/scheduler/dailyReport");
const backupDB = require("@/scheduler/backupDB");

new CronJob("0 2 * * *", dailyReport, null, true);
new CronJob("0 3 * * *", backupDB, null, true);

// const job = new CronJob(
// 	'* * * * * *', // cronTime
// 	function () {
// 		console.log('You will see this message every second');
// 	}, // onTick
// 	null, // onComplete
// 	true, // start
// 	'America/Los_Angeles' // timeZone
// );
