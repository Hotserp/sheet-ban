const jwt = require("njwt");

const createToken = () => {
  const claims = { iss: "user", sub: "auth" };
  const token = jwt.create(claims, process.env.SECRET_PHRASE);
  token.setExpiration(new Date().getTime() + 60 * 60 * 1000); // 1 hour;

  return token.compact();
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_PHRASE, (err, verifiedJwt) => {
      if (err) {
        return reject(err);
      }
      return resolve(verifiedJwt);
    });
  });
};

module.exports = {
  createToken,
  verifyToken,
};
