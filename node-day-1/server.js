require("dotenv").config();

require("module-alias/register");

const express = require("express");
const rootRouter = require("@/routes");
const response = require("@/middlewares/response.middleware");
const errorHandler = require("@/middlewares/errorHandler.middleware");
const notFound = require("@/middlewares/notFound.middleware");

require("@/config/database");

const app = express();

// Constant
const port = 3000;

// Middlewares
app.use(express.static("public"));

app.use(express.json());

app.use(response);

app.use("/api", rootRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
