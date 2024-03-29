const express = require("express");
const router = express.Router({ caseSensitive: true, strict: true });
const Axios = require("axios");
const BASE = `https://api.bannerbear.com/v2/images`;
require('dotenv').config();
const BANNER_KEY = process.env.BANNER_KEY;

router.route("/").post(async (req, res) => {
  const { theVideo } = req?.body;

  try {
    const request = await Axios.post(BASE, { body: { theVideo } },{Headers:{
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${BANNER_KEY}`
    }});

    if (request.length > 0) {
      res.status(200).json(request.data);
    } else {
      res.status(404).json({ Alert: "No data found!" });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
