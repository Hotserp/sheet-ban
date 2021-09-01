const axios = require("axios");

const logger = require("../services/Logger");

module.exports = async (req, res, next) => {
  try {
    logger.info("verifyUser");
    const token = req.headers.authorization.split(" ")[1];

    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    req.user = userInfo.data;
    next();
  } catch (err) {
    logger.error("verifyUserError", err);
    res
      .status(401)
      .json({
        error: "It looks like your credentials expired. Please try to relogin",
      });
  }
};
