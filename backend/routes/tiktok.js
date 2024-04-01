const express = require("express");
const router = express.Router({ caseSensitive: true, strict: true });
const Axios = require("axios");
const { param } = require("./gemini");
require("dotenv").config();
const BASE = "https://tiktok-full-video-info-without-watermark.p.rapidapi.com/";
const tiktokKey = process.env.TIKTOK_KEY;
const tiktokHost = process.env.TIKTOK_HOST;

router.route("/").post(async (req, res) => {
  const { query } = req?.body;

  try {
    const request = await Axios.get(
      BASE,
      {
        params: {
          params: {
            url: query,
          },
        },
      },
      {
        headers: {
          "X-RapidAPI-Key": tiktokKey,
          "X-RapidAPI-Host": tiktokHost,
        },
      }
    );
    if (request) {
      res.status(200).json(request.data);
    } else {
      res.status(404).json({ Alert: "No data found!" });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;