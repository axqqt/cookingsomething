const express = require("express");
const Router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
let returnData = {};

const geminiKey = process.env.GEMINI_KEY;
const endPoint = `https://open.api.sandbox.rpiprint.com/orders/create`;

const genAI = new GoogleGenerativeAI(geminiKey);

function generatePDF(data, title) {
  const doc = new PDFDocument({ margin: 30, size: "A4" });
  const writeStream = fs.createWriteStream(`${title}.pdf`);
  doc.pipe(writeStream);

  // Set font and styling
  doc.font("Helvetica");
  doc.fillColor("black");

  // Add title
  doc.fontSize(24).text(title, { align: "center" });
  doc.moveDown();

  // Iterate through data and add content
  for (const [topic, content] of Object.entries(data)) {
    doc.fontSize(18).text(topic, { underline: true });
    doc.moveDown();

    // Split content into lines and add each line to the PDF
    const lines = content.split("\n");
    for (const line of lines) {
      if (line.trim() !== "") {
        doc.fontSize(12).text(line.trim());
        doc.moveDown();
      }
    }

    doc.moveDown();
  }

  doc.end();
}

async function generateSubpoints(jsonData, title) {
  // Get the generative model instance (assuming genAI is a library)
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Object to store generated content for each subpoint
  const generatedContent = {};

  // Track current chapter and subpoint index for iteration
  let currentChapterIndex = 0;
  let currentSubpointIndex = 0;

  // Variables for request count and last request time for rate limiting
  let requestCount = 0;
  let lastRequestTime = 0;

  // Helper function to generate subpoint with delay
  const generateSubpointWithDelay = async () => {
    // Handle reaching the end of chapters and subpoints
    if (
      currentSubpointIndex ===
      jsonData.chapters[currentChapterIndex].topics.length
    ) {
      currentSubpointIndex = 0;
      currentChapterIndex++;
      if (currentChapterIndex === jsonData.chapters.length) {
        return; // All chapters and subpoints processed
      }
    }

    const chapter = jsonData.chapters[currentChapterIndex];
    const subpoint = chapter.topics[currentSubpointIndex];

    // Construct the prompt for generating subpoint content
    const subtopicPrompt = `Create a subpoint for the topic "${subpoint}" where the subpoint is a detailed explanation of the topic. The subpoint should be at least 3 sentences long. Don't include any \\n or \` characters in the JSON. This is for a eBook titled "${title}".`;

    const currentTime = Date.now();
    const delay = Math.max(0, 400 - (currentTime - lastRequestTime)); // Calculate delay based on rate limit

    try {
      // Wait for the delay before next request using Promise
      await new Promise((resolve) => setTimeout(resolve, delay));
      requestCount++;
      lastRequestTime = currentTime;

      // Generate content for the subpoint prompt
      const result = await model.generateContent(subtopicPrompt);
      const response = result.response;

      if (response && response.text) {
        generatedContent[subpoint] = response.text();
        console.log(`Generated subpoint for "${subpoint}":\n`, response.text());
      }
    } catch (error) {
      console.error(`Error generating subpoint for "${subpoint}":`, error);
    }

    currentSubpointIndex++;
  };

  // Loop through chapters and subpoints, generating content with delays using Promises
  for (
    let currentChapterIndex = 0;
    currentChapterIndex < jsonData.chapters.length;
    currentChapterIndex++
  ) {
    for (
      let currentSubpointIndex = 0;
      currentSubpointIndex <
      jsonData.chapters[currentChapterIndex].topics.length;
      currentSubpointIndex++
    ) {
      await generateSubpointWithDelay();
    }
  }
  // Return the generated content object after all subpoints are processed
  return generatedContent;
}

let theTitle;
let theOutcome = [];

Router.route("/").post(async (req, res) => {
  try {
    // Extract pages and title from the request body
    const { pages, title } = req?.body;

    // Check for missing data (pages or title) and return an error with status code 400 (Bad Request)
    if (!pages || !title) {
      return res.status(400).json({ alert: "Pages/Title REQUIRED!" });
    }

    // Get the generative model instance (assuming genAI is a library providing the model)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Construct the prompt for generating a book outline in JSON format
    const prompt = `Create a book outline in JSON format for a book titled "${title}". The outline should have 10 chapters, each containing 3 bulleted topic points. Dont include any \\n or \` characters in the JSON. Avoid any characters that may cause JSON.parse to fail. Also make sure the JSON is in the format {"chapters": [{"title": "Chapter 1", "topics": ["Topic 1", "Topic 2", "Topic 3"]}, ...]}.`;

    // Generate the book outline using the model and the prompt
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Check for errors or missing data in the outline generation response
    if (!response || !response.text) {
      return res.status(400).json({ alert: "No data retrieved" });
    }

    const text = response.text(); // Extract the generated text from the response

    // Check if the generated text has content
    if (text.length !== 0) {
      try {
        // Parse the generated text as JSON
        const jsonData = JSON.parse(text);

        // Call the generateSubpoints function to generate detailed explanations for each subpoint in the outline
        await generateSubpoints(jsonData, title).then(
          (content) => {
            generatePDF(content, title);

            returnData = content;
          } // Generate PDF with the generated content
        );

        // Return a successful response (status code 200) with the generated content
        return res.status(200).json({ returnData });
      } catch (error) {
        console.error("Error parsing JSON or generating subpoints:", error);
        // Return an error response (status code 500) if parsing or subpoint generation fails
        return res.status(500).json({ alert: "Internal server error" });
      }
    } else {
      // Return an error response (status code 404) if no data was retrieved from the outline generation
      return res.status(404).json({ alert: "No data retrieved" });
    }
  } catch (err) {
    console.error("Error in the route handler:", err);
    // Return an error response (status code 500) for any unexpected errors in the route handler
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
