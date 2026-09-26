require("dotenv").config();

require("module-alias/register");
const tasks = require("./src/tasks");

console.log(tasks);

const constants = require("@/config/constants");
const queueModel = require("@/models/queue.model");
const sleep = require("@/utils/sleep.js");

require("@/config/database");

(async () => {
    while (true) {
        const pendingJobs = await queueModel.findOnePending();

        if (pendingJobs) {
            const type = pendingJobs.type;
            const payload = JSON.parse(pendingJobs.payload);

            switch (type) {
                case "sendVerifyEmail":
                    try {
                        console.log(`Job: "${type} is processing..."`);

                        await queueModel.updateStatus(
                            pendingJobs.id,
                            constants.QUEUE_STATUS.INPROGRESS,
                        );

                        const handle = tasks[type];
                        if (!handle) {
                            throw new Error(
                                `khong co ham xu ly cho : "${type}"`,
                            );
                        }
                        await handle(payload);

                        await queueModel.updateStatus(
                            pendingJobs.id,
                            constants.QUEUE_STATUS.COMPLETED,
                        );

                        console.log(`Job: "${type} is processed"`);
                    } catch (error) {
                        console.error(`Job "${type}" failed:`, error);

                        await queueModel.updateStatus(
                            pendingJobs.id,
                            constants.QUEUE_STATUS.FAILED,
                        );
                    }
            }
        }

        await sleep(1000);
    }
})();
