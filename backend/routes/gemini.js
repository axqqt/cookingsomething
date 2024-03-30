const express = require("express");
const router = express.Router({ caseSensitive: true, strict: true });
const Axios = require("axios");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage})
const geminiKey = process.env.GEMINI_KEY;
// const BASE = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`;

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

router.route("/images", upload.single("image")).post(async (req, res) => {
  const { img } = req?.file;

  try {
    const formData = new FormData();
    formData.append("content", img);

    const response = await Axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${geminiKey}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    if (response && response.data) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ Alert: "No data found!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ Alert: "Internal server error" });
  }
});

module.exports = router;
