const express = require("express");

const googleRouter = require("./google.js");
const compareRouter = require("./compare.js");

const auth = require("../middlewares/verifyUser");

const router = express.Router();

router.use("/google", googleRouter);
router.use("/compare", auth, compareRouter);

module.exports = { router };
