const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware")

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/signup', authController.signup);
router.get('/accounts', authMiddleware(["superadmin"]), authController.accounts)
router.patch('/approve/:id', authMiddleware(['superadmin']), authController.approval)

module.exports = router;
