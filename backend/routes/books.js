const express = require("express");
const Router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const geminiKey = process.env.GEMINI_KEY;
const endPoint = `https://open.api.sandbox.rpiprint.com/orders/create`;

const genAI = new GoogleGenerativeAI(geminiKey);

function generatePDF(textArray, title) {
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(title + ".pdf");

  doc.pipe(writeStream);

  for (const chapter of textArray) {
    const lines = chapter.split("\n");
    const chapterTitle = lines[0].slice(2, -2);
    doc.moveDown(); // Add spacing
    doc.fontSize(18).font("Helvetica-Bold").text(chapterTitle);
    doc.font("Helvetica");
    const bulletPoints = lines.slice(1);
    for (const point of bulletPoints) {
      doc.text(point.slice(2));
    }
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
    const prompt = `Create a book outline in JSON format for a book titled "${title}". The outline should have 10 chapters, each containing 3 bulleted topic points. Dont include any \\n or \` characters in the JSON.`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text) {
      return res.status(400).json({ alert: "No data retrieved" });
    }

    const text = response.text();

    if (text.length !== 0) {
      const jsonData = JSON.parse(text); // Parse the JSON string

      return res.status(200).json({ jsonData });
    } else {
      return res.status(404).json({ alert: "No data retrieved" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ alert: "Internal server error" });
  }
});

Router.route("/generate-subpoints").post(async (req, res) => {
  try {
    const { subpoints } = req.body;

    if (!subpoints || subpoints.length === 0) {
      return res.status(400).json({ alert: "Subpoints required!" });
    }

    const generatedContent = [];
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    for (const subpoint of subpoints) {
      const result = await model.generateContent(subpoint);
      const response = result.response;
      if (response && response.text) {
        generatedContent.push(response.text());
      }
    }

    return res.status(200).json({ generatedContent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ alert: "Internal server error" });
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

module.exports = Router;
