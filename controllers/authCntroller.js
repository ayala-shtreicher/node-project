const asyncWrap = require("../utils/asyncwrapper");
const { decodeToken } = require("../utils/jwt");
const AppError = require("./../utils/AppError");
const { User } = require("../models/User.model");

exports.authNoPermistion = asyncWrap(async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);
  token = token.split(" ")[1];
  const payload = decodeToken(token);
  res.locals.userId = payload._doc._id;
  next();
});
