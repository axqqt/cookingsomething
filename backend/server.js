const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const db = require("./database/db");
const cors = require("cors");
const mainRoute = require('./routes/images')
const loginRoute = require('./routes/login')
const registerRoute = require("./routes/register");
const vidsRoute = require("./routes/vids");
const geminiRoute = require('./routes/gemini')

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ Alert: "Hi Docker 🐋" });
  });

app.use("/main",mainRoute);
app.use("/books",require("./routes/books"))
app.use("/register",registerRoute)
app.use("/login",loginRoute)
app.use("/vids",vidsRoute);
app.use("/gemini",geminiRoute)
app.use("/tiktoks",require("./routes/tiktok"))

app.use("*", (req, res) => {
  res.json({ Alert: "Unknown Route!" });
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
