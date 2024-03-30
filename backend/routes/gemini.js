const express = require("express");
const router = express.Router({ caseSensitive: true, strict: true });
const Axios = require("axios");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const geminiKey = process.env.GEMINI_KEY;
const BASE = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`;

router.route("/").post(async (req, res) => {
  const { prompt } = req?.body;

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (text) {
      res.status(200).json({ Output: text });
    } else {
      res.status(404).json({ Alert: "NO data found!" });
    }
  } catch (err) {
    console.error(err);
  }
});

router.route("/images").post(async (req, res) => {
  const { img } = req?.file;

  try {
    const response = await Axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${geminiKey}`,
      { Headers: { "Content-Type": "application/json" } },
      { data: img }
    );
    if (response) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ Alert: "NO data found!" });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;