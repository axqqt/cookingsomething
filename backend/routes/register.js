const express = require("express");
const router = express.Router({ caseSensitive: true, strict: true });
const userModel = require("../models/registration");

router.route("/").post(async (req, res) => {
  const { username, password } = req?.body;
  if (!username || !password)
    return res.status(400).json({ Alert: "Username and password required!" });

  const userExists = await userModel.findOne({ username });
  if (!userExists) {
    const newUser = await userModel.create({ username, password });
    if (newUser) {
      res.status(201).json({ Alert: `Registered ${username}` });
    } else {
      res.status(400).json({ Alert: "Error while creating user!" });
    }
  } else {
    res.status(404).json({ Alert: "No Username/Password found!" });
  }
});

module.exports = router;
