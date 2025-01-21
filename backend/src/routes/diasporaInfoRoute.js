const express = require("express");
const router = express.Router();
const diaspora = require('../controllers/diasporaInfoController')
const authMiddleware = require("../middlewares/authMiddleware")
const multer = require("multer");

// Set up multer for handling form data (and file uploads if needed)
const upload = multer();

router.post("/diaspora-info", upload.none(), diaspora.profile)
router.get("/diaspora-list", diaspora.diasporaList)
router.get('/diaspora-passport', diaspora.DiasporaPassports)
router.get('/diaspora-address', diaspora.diasporaAddress)
router.get("/diaspora-skill", diaspora.diasporaSkill)
router.put("/diaspora-info-edit/:id", diaspora.diasporaInfoEditor)
router.put("/diaspora-skill-edit/:id", diaspora.editDiasporaSkill)
router.put("/diaspora-passport-edit/:id", diaspora.EditDiasporaPassport)
router.put("/diaspora-address-edit/:id", diaspora.editDiasporaAddress)
router.delete("/diaspora-delete/:id", diaspora.deleteDiaspora)
router.delete("/skill-delete/:id", diaspora.deleteSkill)
  

module.exports = router;
