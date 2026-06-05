const express = require("express");
const route = express.Router();
const morgan = require("morgan");
const EmployeesModel = require("../models/employeesModel");
const LeavesModel = require("../models/leavesModel");
const RolesModel = require("../models/rolesModel");
const errHandler = require("../utils/errHandler");
const { successResponse } = require("../utils/responseHandler");
const { errorResponse } = require("../utils/responseHandler");
const { pagination } = require("../helpers/paginationHelper");
const { leaveStatus } = require("../helpers/enumHelper");
const createError = require("http-errors");
const logger = require("../config/logger");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../utils/authMiddleware");
const { raw } = require("objection");

//get employee's manager
exports.employeesManager = async (id) => {
  console.log(Object.keys(EmployeesModel.getRelations()));
  const result = await EmployeesModel.query()
    .findById(id)
    .withGraphFetched("manager");
  console.log(Object.keys(EmployeesModel.getRelations()));
  return result;
};

//get  manager's employees
exports.managersEmployees = async (id) => {
  const result = await EmployeesModel.query()
    .findById(id)
    .withGraphFetched("subordinates");
  return result;
};

//create Employee
exports.createEmployee = async (name, email, password) => {
  logger.info("[postEmployee]: Employees service hit");
  if (!name || !email || !password) {
    //if name and email not mentioned in the body,throws error
    logger.error("[postEmployee]: Both name and email fields are required");
    throw createError(406, "Name,email,password fields are required");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // save in PostgreSQL
  const employee = await EmployeesModel.query().insert({
    name,
    email,
    password: hashedPassword,
  });
  return employee;
};

//get leaves of all employees per particular month
exports.allEmployeeLeavesPerMonth = async (month, page, limit) => {
  const result = EmployeesModel.query()
    .leftJoin("leaves", function () {
      this.on("employees.id", "=", "leaves.emp_id").andOn(
        raw("TO_CHAR(leaves.from_date, 'YYYY-MM') = ?", [month]),
      );
    })
    .select("employees.name", raw("COUNT(leaves.id) as total_leaves"))
    .groupBy("employees.id", "employees.name")
    .orderBy("employees.name");
  return result;
};
//Add employee
exports.postEmployee = async (name, email) => {
  logger.info("[postEmployee]: Employees service hit");
  if (!name || !email) {
    //if name and email not mentioned in the body,throws error
    logger.error("[postEmployee]: Both name and email fields are required");
    throw createError(406, "Both name and email fields are required");
  }

  const result = await EmployeesModel.query().insert({ name, email }); //Inserts name and email from request body into employees table
  return result;
};
//get employees
exports.getEmployees = async (role, page, limit) => {
  logger.info("[getEmployees]: Employees service hit");
  //console.log(role);
  const result = EmployeesModel.query()
    .select("*")
    .withGraphFetched("roles")
    .modifyGraph("roles", (qb) => {
      if (role) {
        qb.where("name", role);
      }
    });
  console.log("hereeee");
  const data = await pagination(result, page, limit);
  return data;
};

//get employee by id
exports.getEmployeeById = async (id) => {
  logger.info("[getEmployeeById]: Employees service hit");
  const result = await EmployeesModel.query().findById(id); //fetch all columns from the employees table with given id
  if (!result) {
    //if no employee found with given id , throw error
    logger.error(`[getEmployeeById]: Missing Data for id : ${id}`);
    throw createError(404, "Employee not found");
  }
  return result;
};

//update employee
exports.updateEmployee = async (id, name, email) => {
  logger.info("[updateEmployee]: Employees service hit");
  if (!name && !email) {
    //if name and email are not mentioned throw an error
    logger.error("[updateEmployee]: Both name and email fields are required");
    throw createError(406, "name,email any one field is required");
  }
  const existingUser = await EmployeesModel.query().findById(id); //checking if an employee exists with given id
  if (!existingUser) {
    //if there is no employee with given id ,throw an error
    logger.error(`[updateEmployee]: Missing Data for id : ${id}`);
    throw createError(404, "Employee not found");
  }
  const duplicate = await EmployeesModel.query() //to find a duplicate employee
    .where((builder) => {
      //using builder(object) used to combine queries
      if (name) {
        builder.where("name", name);
      }

      if (email) {
        builder.orWhere("email", email);
      }
    })
    .whereNot("id", id); //if given name or email found with different id ,then name or email can be duplicate
  if (duplicate.length > 0) {
    //as duplicate returns array, if duplicate array length is greater than zero throw an error
    logger.error("[updateEmployee]: name,email alread exists");
    throw createError(409, "name,email alread exists");
  }
  const result = await EmployeesModel.query().patchAndFetchById(id, {
    name,
    email,
  }); //add name,email and fetch the employee record by id
  return result;
};

//delete an employee
exports.deleteEmployee = async (id) => {
  logger.info("Employees service hit");
  const result = await EmployeesModel.query().deleteById(id).returning("*"); //delete employee with given id and return the deleted object(employee)
  if (!result) {
    //if no employee was found with given id return error response
    logger.error(`[deleteEmployee]: Missing Data for id : ${id}`);
    throw createError(404, `Employee with given id ${id} not found`);
  }
  return result;
};
