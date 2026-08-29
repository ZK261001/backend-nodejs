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

// Middleware áp dụng cho mọi request
// app.use(() => {
//     // ...
// });

// // Middleware áp dụng cho mọi request GET
// app.get(() => {
//     // ...
// });

// // Middleware áp dụng cho mọi request POST /xyz
// app.post("/xyz", () => {
//     // ...
// });

app.use("/api", rootRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
