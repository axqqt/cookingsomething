const express = require("express");
const Router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const { exec } = require("child_process");
const path = require("path");
const Docxtemplater = require("docxtemplater");

function generateDOCX(data, title) {
  const templatePath = path.join(__dirname, "template.docx");

  if (!fs.existsSync(templatePath)) {
    const defaultTemplateContent = "";
    fs.writeFileSync(templatePath, defaultTemplateContent);
  }

  const content = fs.readFileSync(templatePath, "binary");
  const doc = new Docxtemplater();
  doc.loadZip(content);

  doc.setData({
    title: title,
    topics: Object.keys(data).map((topic) => ({
      name: topic,
      content: data[topic],
    })),
  });

  doc.render();
  const buf = doc.getZip().generate({ type: "nodebuffer" });

  fs.writeFileSync(`${title}.docx`, buf);
}

async function generateSubpoints(jsonData, title) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const generatedContent = {};

    for (let currentChapterIndex = 0; currentChapterIndex < jsonData.chapters.length; currentChapterIndex++) {
      for (let currentSubpointIndex = 0; currentSubpointIndex < jsonData.chapters[currentChapterIndex].topics.length; currentSubpointIndex++) {
        const chapter = jsonData.chapters[currentChapterIndex];
        const subpoint = chapter.topics[currentSubpointIndex];
        const subtopicPrompt = `Create a subpoint for the topic "${subpoint}" where the subpoint is a detailed explanation of the topic. The subpoint should be at least 3 sentences long. Don't include any \\n or \` characters in the JSON. This is for an eBook titled "${title}".`;

        const result = await model.generateContent(subtopicPrompt);
        const response = result.response;
        if (response && response.text) {
          const generatedText = response.text();
          if (generatedText) {
            generatedContent[subpoint] = generatedText;
            console.log(`Generated subpoint for "${subpoint}":\n`, generatedText);
          } else {
            console.error(`Empty response for "${subpoint}"`);
          }
        } else {
          console.error(`No response for "${subpoint}"`);
        }
      }
    }
    return generatedContent;
  } catch (error) {
    console.error("Error generating subpoints:", error);
    throw error;
  }
}


Router.route("/").post(async (req, res) => {
  try {
    const { pages, title } = req?.body;
    if (!pages || !title) {
      return res.status(400).json({ alert: "Pages/Title REQUIRED!" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Create a book outline in JSON format for a book titled "${title}". The outline should have 10 chapters, each containing 3 bulleted topic points. Dont include any \\n or \` characters in the JSON. Avoid any characters that may cause JSON.parse to fail. Also make sure the JSON is in the format {"chapters": [{"title": "Chapter 1", "topics": ["Topic 1", "Topic 2", "Topic 3"]}, ...]}.`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response || !response.text) {
      return res.status(400).json({ alert: "No data retrieved" });
    }

    const text = response.text();
    if (text.length !== 0) {
      try {
        const jsonData = JSON.parse(text);
        const content = await generateSubpoints(jsonData, title);
        generateDOCX(content, title);

        let returnData = content;

        exec(`python ../scripts/canva.py "${title}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error running Python script: ${error}`);
            return res.status(500).json({ alert: "Internal server error" });
          }

          console.log(`Python script output: ${stdout}`);
          console.error(`Python script error: ${stderr}`);

          res.status(200).json({ returnData });
        });
      } catch (error) {
        console.error("Error parsing JSON or generating subpoints:", error);
        return res.status(500).json({ alert: "Internal server error" });
      }
    } else {
      return res.status(404).json({ alert: "No data retrieved" });
    }
  } catch (err) {
    console.error("Error in the route handler:", err);
    return res.status(500).json({ alert: "Internal server error" });
  }
});

Router.route("/gather").post(async (req, res) => {
  try {
    if (theOutcome.length) {
      // You need to define the generatePDF function
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
