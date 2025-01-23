const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

router.post("/create-company", companyController.createCompany);
router.get("/get-company", companyController.getCompany);
router.put("/edit-company/:id", companyController.editCompany);
router.patch("/edit-director/:id", companyController.editDirector);
router.delete("/delete-company/:id", companyController.deleteCompany);

module.exports = router;