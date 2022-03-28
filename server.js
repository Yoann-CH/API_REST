const express = require("express");
const mysql = require('mysql');
const securityRouter = require("./routes/security");
const userRouter = require("./routes/user");
const articleRouter = require("./routes/article");
const commentRouter = require("./routes/comment");
const connection = require("./lib/db");
const verifyJWT = require("./middlewares/verifyJWT");
connection.sync();
const app = express();
app.use(express.json());

app.use("", securityRouter);
app.use("/users", userRouter);
app.use(verifyJWT);
app.use("/articles", articleRouter);
app.use(verifyJWT);
app.use("/comments", commentRouter);

app.listen(3000, () => console.log("Server is listening"));
