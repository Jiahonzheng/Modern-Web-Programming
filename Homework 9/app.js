const bodyParser = require("body-parser");
const connect = require("connect-mongo");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const config = require("./config");
const router = require("./routes");

mongoose.connect(config.MongoURI);

const app = express();
const db = mongoose.connection;
const MongoSore = connect(session);

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("connection established"));
app.disable("view cache");
app.set("view engine", "pug");
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  if (req.url.includes("login.html") || req.url.includes("register.html"))
    return res.status(403).end("403 Forbidden");
  next();
});
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(
  session({
    secret: "16305204",
    resave: true,
    saveUninitialized: false,
    store: new MongoSore({ mongooseConnection: db })
  })
);
app.use(router);
app.listen(config.Port);
