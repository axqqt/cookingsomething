const express = require("express");
const Router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const PDFDocument = require("pdfkit");
const fs = require("fs");

let theTitle;
let theOutcome = [];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

function generatePDF(textArray, title) {
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(`${title}.pdf`);

  doc.pipe(writeStream);

  for (const chapter of textArray) {
    const lines = chapter.split("\n");
    const chapterTitle = lines[0].replace(/^\*|\*$/g, "").trim();
    doc.moveDown().fontSize(18).font("Helvetica-Bold").text(chapterTitle);

    for (let i = 1; i < lines.length; i++) {
      const bulletPoint = lines[i].replace(/^\-|\-$/g, "").trim();
      doc.font("Helvetica").text(bulletPoint);
    }
  }

  doc.end();
}

async function generateSubpoints(jsonData, title) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const generatedContent = {};

  for (const chapter of jsonData.chapters) {
    for (const subpoint of chapter.topics) {
      const subtopicPrompt = `Create a subpoint for the topic "${subpoint}" where the subpoint is a detailed explanation of the topic. The subpoint should be at least 3 sentences long. Don't include any \\n or \` characters in the JSON. This is for an eBook titled "${title}".`;

      try {
        const result = await model.generateContent(subtopicPrompt);
        const response = result.response;

        if (response && response.text) {
          generatedContent[subpoint] = response.text();
          console.log(`Generated subpoint for "${subpoint}":\n`, response.text());
        }
      } catch (error) {
        console.error(`Error generating subpoint for "${subpoint}":`, error);
      }
    }
  }

  return generatedContent;
}

Router.route("/").post(async (req, res) => {
  try {
    const { pages, title } = req.body;

    if (!pages || !title) {
      return res.status(400).json({ alert: "Pages/Title REQUIRED!" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Create a book outline in JSON format for a book titled "${title}". The outline should have 10 chapters, each containing 3 bulleted topic points. Don't include any \\n or \` characters in the JSON. Avoid any characters that may cause JSON.parse to fail. Also make sure the JSON is in the format {"chapters": [{"title": "Chapter 1", "topics": ["Topic 1", "Topic 2", "Topic 3"]}, ...]}. Also attach to key topic, the topic of the book`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text) {
      return res.status(400).json({ alert: "No data retrieved" });
    }

    const text = response.text();

    if (text.length !== 0) {
      const jsonData = JSON.parse(text);
      const generatedContent = await generateSubpoints(jsonData, title);

      if (Object.keys(generatedContent).length !== 0) {
        theOutcome.push(generatedContent);
        theTitle = title;
        return res.status(200).json({ generatedContent });
      } else {
        return res.status(404).json({ Alert: "No results found!" });
      }
    } else {
      return res.status(404).json({ alert: "No data retrieved" });
    }
  } catch (err) {
    console.error("Error in the route handler:", err);
    return res.status(500).json({ alert: "Internal server error" });
  }
});

Router.route("/pdf").post((req, res) => {
  try {
    if (theOutcome.length > 0) {
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

      if (result && result.response && result.response.text) {
        generatedContent.push(result.response.text());
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
