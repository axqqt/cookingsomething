const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const db = require("./database/db");
const cors = require("cors");
const mainRoute = require('./routes/main')
const loginRoute = require('./routes/login')
const registerRoute = require("./routes/register");
const vidsRoute = require("./routes/vids");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ Alert: "Hi Docker 🐋" });
  });

app.use("/main",mainRoute);
app.use("/login",loginRoute)
app.use("/register",registerRoute)
app.use("/vids",vidsRoute)

app.use("*", (req, res) => {
  res.json({ Alert: "Where are u going bro?" });
});


async function start() {
  try {
    // db(); uncomment when database configured
    app.listen(port, console.log(`Servers up on port ${port}`));
  } catch (err) {
    console.error(err);
  }
}

start();
