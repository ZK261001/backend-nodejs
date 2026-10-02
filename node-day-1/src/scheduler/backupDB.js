const { spawn } = require("node:child_process");
const fs = require("fs");

function backupDB() {
    const outputFile = `./backup/blog_dev-${
        new Date().toISOString().split("T")[0]
    }.sql`;

    const outputStream = fs.createWriteStream(outputFile);

    const mysqldump = spawn("mysqldump", [
        `-uadmin`,
        `-padmin`,
        "-P3307",
        "blog_dev",
    ]);

    mysqldump.stdout.pipe(outputStream);

    mysqldump.on("error", (error) => {
        outputStream.end();
        console.error(`mysqldump error: ${error.message}`);
    });

    mysqldump.on("close", (code) => {
        outputStream.end();
        console.log(`child process exited with code ${code}`);

        if (code === 0) {
            console.log(`Backup successfully! File: ${outputFile}`);
        } else {
            fs.unlinkSync(outputFile);
        }
    });
}

module.exports = backupDB;

// mysqldump -uadmin -padmin blog_dev > ./blog_dev-2026-09-30.sql
