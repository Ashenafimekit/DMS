const express = require("express");
const router = express.Router();
const diaspora = require('../controllers/diasporaInfoController')
const authMiddleware = require("../middlewares/authMiddleware")
const multer = require("multer");

// Set up multer for handling form data (and file uploads if needed)
const upload = multer();

// Create Diaspora Info
//router.post("/diaspora-info",upload.none(), diaspora.submitForm)
router.post("/diaspora-info",upload.none(),authMiddleware(['admin']), diaspora.profile)
router.get("/diaspora-list")
  

module.exports = router;
