const { generateError } = require("../helpers");
const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw generateError("Token is required", 401);
    }

    let token;
    try {
      token = jwt.verify(authorization, process.env.SECRET);
    } catch (error) {
      throw generateError("Invalid token", 401);
    }

    req.userId = token.id;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authUser };
