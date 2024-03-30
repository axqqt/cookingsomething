const express = require("express");
const Router = express.Router();
const Axios = require("axios");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const theImages = require("../models/imageVerify");
const geminiKey = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(geminiKey);
const diffusiveKey = process.env.DIFFUSIONKEY;
let theNiche;
let theWrite;
let theProduct;

Router.route("/").post(async (req, res) => {
  try {
    const { theniche, write, productName } = req?.body;

    if (!theniche || !write || !productName) {
      return res
        .status(400)
        .json({ alert: "Niche / what to write/ Product Name REQUIRED!" });
    }

    theNiche = theNiche;
    theWrite = write;
    theProduct = productName;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Write a copywriting script with good keywords for ${write} under ${theniche}, For ${productName}. make sure no symbols are sent , only the text`;

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

Router.route("/images").post(async (req, res) => {
  const { prompt } = req?.body;

  // Check if prompt is provided
  if (!prompt) {
    return res.status(403).json({ Alert: "Prompt required!" });
  }

  try {
    const response = await Axios.post(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      {
        data: `Create a thumbnail about ${theWrite} in ${theNiche}, ${theProduct}. in ${prompt} style! `,
      },
      {
        headers: {
          authorization: `Bearer ${diffusiveKey}`,
        },
      }
    );

    // Handling different response status codes
    switch (response.status) {
      case 200:
        res.status(200).json(response.data);
        break;
      case 400:
        res.status(400).json({ Alert: "BAD Request!" });
        break;
      case 401:
        res.status(400).json({ Alert: "Buy an API key!" });
        break;
      case 403:
        res.status(403).json({ Alert: "Bad prompt!" });
        break;
      case 500:
        res.status(500).json({
          Alert: "An unexpected server error has occurred, please try again later.",
        });
        break;
      default:
        res.status(404).json({ Alert: "NO results found!" });
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Alert: "An unexpected server error has occurred, please try again later.",
    });
  }
});

Router.route("/uploadimg").post(async (req, res) => {
  const { file: image } = req;
  try {
    const addedImage = await theImages.create({ image });
    if (addedImage) {
      res.status(201).json({ Alert: "Image added!" });
    } else {
      res.status(400).json({ Alert: "Error while adding image!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

Router.route("/:id").put(async (req, res) => {
  const { id } = req?.params;
  const { verify } = req?.body;
  if (!id) return res.status(404).json({ Alert: "ID not found!" });

  try {
    const validID = await theImages.findById(id);
    if (!validID) {
      const updated = await validID.updateOne({ verify });
      if (updated) {
        res.status(200).json({ Alert: `Updated ${id}` });
      } else {
        res.status(400).json({ Alert: "Error while updating!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Alert: err });
  }
});

module.exports = Router;
