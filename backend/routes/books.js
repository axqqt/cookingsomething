const express = require("express");
const Router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Axios } = require("axios");
const geminiKey = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(geminiKey);
const diffusiveKey = process.env.DIFFUSIONKEY;
const endPoint = `https://open.api.sandbox.rpiprint.com/orders/create`;

Router.route("/").post(async (req, res) => {
  try {
    const { pages, title } = req?.body;

    if (!pages || !title) {
      return res.status(400).json({ alert: "Pages/Title REQUIRED!" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Write me an ${pages} long ebook for ${title}`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text) {
      return res.status(400).json({ alert: "No data retrieved" });
    }

    const text = response.text();
    if (text.length !== 0) {
      return res.status(200).json({ generatedText: text });
    } else {
      return res.status(404).json({ alert: "No data retrieved" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ alert: "Internal server error" });
  }
});

Router.route("/create").post(async (req, res) => {
  try {
    const request = await Axios.post(
      endPoint,
      {  },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: process.env.GENERATE_BOOK,
        },
      }
    );
    // Handle the response if needed
    console.log(request.data);
    res.status(200).send("Request successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error"); // Respond with an error status
  }
});

module.exports = Router;
