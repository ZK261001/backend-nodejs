// server.mjs
import { log } from "node:console";
import { createServer } from "node:http";

// Fake DB in memory
const db = {
    tasks: [],
};

function serverResponse(res, data) {
    res.writeHead(data.status, { "Content-Type": "text/json" });
    res.end(JSON.stringify(data));
}

const server = createServer((req, res) => {
    let response = {
        status: 200,
        data: undefined,
    };

    // [GET] /api/tasks
    if (req.method === "GET" && req.method === "/api/tasks") {
        response.data = db.tasks;
        serverResponse(res, response);
        return;
    }

    // [GET] /api/tasks/1
    if (req.method === "GET" && req.url.startsWith("/api/tasks/")) {
        const id = req.url.split("/").pop();
        const task = db.tasks.find((_task) => _task.id === id);
        if (task) {
            response.data = task;
        } else {
            response.status = 404;
            response.message = "Resource not found";
        }
        serverResponse(res, response);
        return;
    }

    // [POST] /api/tasks
    if (req.method === "POST" && req.url === "/api/tasks/") {
        let body = "";
        req.on("data", (buffer) => {
            body += buffer.toString();
        });
        req.on("end", () => {
            const payload = JSON.parse(body);
            const newTask = {
                id: String(db.tasks.length + 1),
                title: payload.title,
                isCompleted: false,
            };
            db.tasks.push(newTask);
            response.status = 201;
            response.data = newTask;
            serverResponse(res, response);
        });
        return;
    }
    // [PUT/PATCH] /api/tasks/1
    if (req.method === "PUT" && req.url.startsWith("/api/tasks/")) {
        const id = req.url.split("/").pop();
        let body = "";
        req.on("data", (buffer) => {
            body += buffer.toString();
        });
        req.on("end", () => {
            const payload = JSON.parse(body);
            const oldTask = db.tasks.find((_task) => _task.id === id);
            if (oldTask) {
                oldTask.title = payload.title || oldTask.title;
                oldTask.isCompleted =
                    payload.isCompleted ?? oldTask.isCompleted;
                response.data = oldTask;
            } else {
                response.status = 404;
                response.message = "Resource not found";
            }
            serverResponse(res, response);
        });
        return;
    }

    // [DELETE] /api/tasks/1

    // Other
    serverResponse(res, {
        status: 201,
        data: "OK",
    });
});

// starts a simple http server locally on port 3000
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});

// run with `node server.mjs`
