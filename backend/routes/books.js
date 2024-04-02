const express = require("express");
const Router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const geminiKey = process.env.GEMINI_KEY;
const diffusiveKey = process.env.DIFFUSIONKEY;
const endPoint = `https://open.api.sandbox.rpiprint.com/orders/create`;

const genAI = new GoogleGenerativeAI(geminiKey);

function generatePDF(textArray, title) {
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(title + ".pdf");

  doc.pipe(writeStream);

  let yPos = 50;
  for (let i = 0; i < textArray.length; i++) {
    const text = textArray[i];
    doc.text(text, 50, yPos);
    yPos += 20;
  }

  doc.end();
}

let theTitle;
let theOutcome = [];

Router.route("/").post(async (req, res) => {
  try {
    const { pages, title } = req?.body;

    if (!pages || !title) {
      return res.status(400).json({ alert: "Pages/Title REQUIRED!" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Write me a book outline on ${title} with 10 chapters. Chapters are counted with integers. Topics are bullet points under Chapter topics. Each chapter has 3 topics`;
    theTitle = title;

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text) {
      return res.status(400).json({ alert: "No data retrieved" });
    }

    const text = response.text();
    if (text.length !== 0) {
      theOutcome.push(text);
      return res.status(200).json({ generatedText: text });
    } else {
      return res.status(404).json({ alert: "No data retrieved" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ alert: "Internal server error" });
  }
});

Router.route("/format").post(async (req, res) => {
  // const encodedParams = new URLSearchParams();
  // encodedParams.set("text", theOutcome);
  // encodedParams.set("language", "en-US");

  // try {
  //   const request = await Axios.post(
  //     `https://grammarbot.p.rapidapi.com/check`,
  //     {
  //       headers: {
  //         "content-type": "application/x-www-form-urlencoded",
  //         "X-RapidAPI-Key":
  //          process.env.grammarKey,
  //         "X-RapidAPI-Host": process.env.grammarHost,
  //       },
  //       data: encodedParams,
  //     }
  //   );

  //   if(request.length){
  //     res.status(200).json(request.data)
  //   }else{
  //     res.status(404).json({Alert:"No results found!"})
  //   }
  try {
    //
  } catch (err) {
    console.error(err);
  }
});

Router.route("/gather").post(async (req, res) => {
  try {
    if (theOutcome.length) {
      generatePDF(theOutcome, theTitle);
      res.status(200).json({ message: "PDF generated successfully" });
    } else {
      res.status(404).json({ Alert: "No results found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

Router.route("/create").post(async (req, res) => {
  try {
    const request = await Axios.post(
      endPoint,
      { theOutput },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: process.env.GENERATE_BOOK,
        },
      }
    );
    console.log(request.data);
    res.status(200).send("Request successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Uncommented out routes

Router.route("/cover").post(async (req, res) => {
  const { coverImage } = req?.body;
  try {
    // if (!theTitle) {
    //   return res.status(400).json({ alert: "Title REQUIRED!" });
    // }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Create me an ebook cover for ${coverImage}`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text) {
      return res.status(400).json({ alert: "No data retrieved" });
    }

    const text = response.text();
    if (text.length !== 0) {
      theOutcome.push([...text]);
      return res.status(200).json({ generatedText: text });
    } else {
      return res.status(404).json({ alert: "No data retrieved" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ alert: "Internal server error" });
  }
});

module.exports = Router;
