const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const SessionsModel = require("../models/sessionsModel");
const authMiddleware = async (req, res, next) => {
  try {
    // get authorization header
    const authHeader = req.headers.authorization;
    // check header exists
    if (!authHeader) {
      throw createError(401, "Token required");
    }
    // format:
    // Bearer token
    const token = authHeader.split(" ")[1];
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // check session in DB
    const session = await SessionsModel.query()
      .where("session_id", decoded.sessionId)
      .where("is_active", true)
      .first();

    if (!session) {
      throw new Error("Session expired");
    }
    // save user info in request
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    next(createError(401, "Invalid or expired token"));
  }
};

module.exports = authMiddleware;
