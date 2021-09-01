require("dotenv").config();
const express = require("express");
const cors = require("cors");

const path = require("path");

const logger = require("./services/Logger");
const { router } = require("./router");

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, optionsSuccessStatus: 200 }));

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(__dirname, "/dist/index.html");
});

app.use("/api", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info("serverStarted on port", { port: PORT });
});
