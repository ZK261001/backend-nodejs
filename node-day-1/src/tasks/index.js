const fs = require("fs");

const basePath = "./src/tasks";

const postfix = "Task.js";
const entries = fs
    .readdirSync(basePath)
    .filter((filename) => filename.endsWith(postfix));

const taskMap = entries.reduce((obj, fileName) => {
    return {
        ...obj,
        [fileName.replace(postfix, "")]: require(`./${fileName}`),
    };
}, {});

module.exports = taskMap;
