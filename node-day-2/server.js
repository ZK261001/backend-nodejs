require("dotenv").config();
require("./polyfill");

const express = require("express");

const customResponse = require("./src/middlewares/customResponse");
const rootRouter = require("./src/routes");

const app = express();
const port = 3000;

//Middlewares
app.use(express.json());
app.use(customResponse);

// Router
app.get("/", async (req, res) => {
    res.send("Hello World");
});

app.use("/api", rootRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
