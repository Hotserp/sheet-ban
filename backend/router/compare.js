const express = require("express");

const compareController = require("../controllers/compare.js");

const router = express.Router();

router.post("/", compareController.createComparePair);
router.get("/", compareController.getAllPairs);
router.delete("/:id", compareController.deletePair);

module.exports = router;
