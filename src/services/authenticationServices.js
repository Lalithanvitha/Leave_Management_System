const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const EmployeesModel = require("../models/employeesModel");
const SessionsModel = require("../models/sessionsModel");
const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const express = require("express");
const route = express.Router();
const morgan = require("morgan");
const {
  errorResponse,
  paginationResponse,
  successResponse,
} = require("../utils/responseHandler");
//const crypto = require("crypto");

exports.login = async (email, password) => {
  //const { email, password } = req.body;
  // check user
  const employee = await EmployeesModel.query().where("email", email).first();
  if (!employee) {
    throw createError(401, "Invalid email");
  }
  // compare password
  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    throw createError(401, "Invalid password");
  }
  // generate session id
  const sessionId = uuidv4();
  // create token
  const token = jwt.sign(
    {
      id: employee.id,
      email: employee.email,
      sessionId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  // store session in DB
  await SessionsModel.query().insert({
    emp_id: employee.id,
    session_id: sessionId,
    is_active: true,
  });
  return { token };
};

//logout
exports.logout = exports.logout = async (sessionId) => {
  await SessionsModel.query()
    .patch({
      is_active: false,
    })
    .where("session_id", sessionId);

  return {
    message: "Logged out successfully",
  };
};
