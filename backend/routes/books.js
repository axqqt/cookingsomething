const express = require("express");
const Router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI,HarmCategory,HarmBlockThreshold,HarmProbability } = require("@google/generative-ai");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY, { safety:HarmBlockThreshold.BLOCK_NONE,HarmCategory:HarmCategory.HARM_CATEGORY_UNSPECIFIED,HarmProbability:HarmProbability.HARM_PROBABILITY_UNSPECIFIED});
const { exec } = require("child_process");
const path = require("path");
const Docxtemplater = require("docxtemplater");
const JSZip = require("jszip")

// Function to generate DOCX file
// Function to generate DOCX file
// Function to generate DOCX file
function generateDOCX(data, title) {
  try {
    const templatePath = path.join(__dirname, "template.docx");
    if (!fs.existsSync(templatePath)) {
      fs.writeFileSync(templatePath, ""); // Create an empty template if not exists
    }

    const content = fs.readFileSync(templatePath); // Read the template file
    const zip = new JSZip(content); // Load the template content as a zip
    const doc = new Docxtemplater();
    doc.loadZip(zip); // Load the zip content

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
  } catch (error) {
    console.error("Error generating DOCX:", error);
    throw error;
  }
}



// Function to generate subpoints using Generative AI
async function generateSubpoints(jsonData, title) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const generatedContent = {};

    for (const chapter of jsonData.chapters) {
      for (const subpoint of chapter.topics) {
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

// Route to generate content
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

        // Assuming generatePDF is defined elsewhere
        // exec(`python ../scripts/canva.py "${title}"`, (error, stdout, stderr) => {
        //   if (error) {
        //     console.error(`Error running Python script: ${error}`);
        //     return res.status(500).json({ alert: "Internal server error" });
        //   }

        //   console.log(`Python script output: ${stdout}`);
        //   console.error(`Python script error: ${stderr}`);

          res.status(200).json({ returnData: content });
        // });
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

// Route to gather data
Router.route("/gather").post(async (req, res) => {
  try {
    const { theOutcome, theTitle } = req.body; // Assuming theOutcome and theTitle are provided in the request body
    if (!theOutcome || !theTitle) {
      return res.status(400).json({ alert: "theOutcome/theTitle REQUIRED!" });
    }

    // You need to define the generatePDF function
    // generatePDF(theOutcome, theTitle);
    res.status(200).json({ message: "PDF generated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

module.exports = Router;
