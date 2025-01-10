const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware")

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/signup', authController.signup);

module.exports = router;
