const { OAuth2Client } = require("google-auth-library");

const logger = require("../services/Logger.js");

const oauthClient = new OAuth2Client({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

const getGoogleAuthJWT = async (req, res) => {
  const { code } = req.body;
  const { tokens } = await oauthClient.getToken(code);
  logger.info(`tokens`, tokens);

  res.json({ accessToken: tokens.access_token });
};

const getGoogleAuthLink = async (req, res) => {
  const authorizeUrl = oauthClient.generateAuthUrl({
    access_type: "offline",
    scope:
      "openid email profile https://www.googleapis.com/auth/user.gender.read",
    include_granted_scopes: true,
    /* https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets */
  });

  res.json({ authorizeUrl });
};

module.exports = {
  getGoogleAuthJWT,
  getGoogleAuthLink,
};
