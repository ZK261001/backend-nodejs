require("dotenv").config();

require("module-alias/register");

const express = require("express");
const rootRouter = require("@/routes");
const response = require("@/middlewares/response");
const errorHandler = require("@/middlewares/errorHandler");
const notFound = require("@/middlewares/notFound");
const cors = require("cors");

require("@/config/database");

const app = express();

// Constant
const port = 3000;

// Middlewares
app.use(express.static("public"));

app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.use(response);

app.use(express.json());

app.use("/api", rootRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
