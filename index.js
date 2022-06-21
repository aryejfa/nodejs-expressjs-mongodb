const express = require("express");
const routerUsers = require("./router/users");

const app = express();
const port = 3009;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost/db_ejfa");
}

const myLogger = function (req, res, next) {
  console.log(req.url);
  next();
};
app.use(myLogger);

app.set("view engine", "ejs");

app.use("/assets", express.static("public"));

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.use(routerUsers);

app.listen(port, () => {
  console.log(`server run port ${port}`);
});
