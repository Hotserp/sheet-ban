const express = require("express");

const googleController = require("../controllers/google.js");

const router = express.Router();

router.post("/auth", googleController.getGoogleAuthJWT);
router.get("/link", googleController.getGoogleAuthLink);
// router.get("/callback", googleController.googleRedirect);

module.exports = router;
