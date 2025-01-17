const express = require("express");
const router = express.Router();
const diaspora = require('../controllers/diasporaInfoController')
const authMiddleware = require("../middlewares/authMiddleware")
const multer = require("multer");

// Set up multer for handling form data (and file uploads if needed)
const upload = multer();

router.post("/diaspora-info",upload.none(),authMiddleware(['superadmin', 'admin', 'member']), diaspora.profile)
router.get("/diaspora-list",diaspora.diasporaList)
router.put("/diaspora-info-edit/:id", diaspora.diasporaInfoEditor)
router.delete("/diaspora-delete/:id", diaspora.deleteDiaspora)
  

module.exports = router;
