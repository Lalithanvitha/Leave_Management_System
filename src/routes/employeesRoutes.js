const express = require("express");
const route = express.Router();
//const wrapRoutes = require('../utils/wrapRoutes');
//const employeesServices = require('../services/employeesServices');
const {
  getEmployees,
  getEmployeeById,
  postEmployee,
  updateEmployee,
  deleteEmployee,
  createEmployee,
  allEmployeeLeavesPerMonth,
  employeesManager,
  managersEmployees,
} = require("../services/employeesServices");
const errHandler = require("../utils/errHandler");
const {
  errorResponse,
  paginationResponse,
  successResponse,
} = require("../utils/responseHandler");
const logger = require("../config/logger");
const {
  EmployeesBodySchema,
  EmployeesQuerySchema,
  EmployeesParamsSchema,
} = require("../validations/EmployeesSchema");
const validate = require("../utils/validate");
const authMiddleware = require("../utils/authMiddleware");

//get employees manager
route.get(
  "/employeesManager/:id",
  authMiddleware,
  validate(EmployeesQuerySchema, "query"),
  async (req, res, next) => {
    errHandler(req, res, async () => {
      const { id } = req.params;
      const result = await employeesManager(id);
      return successResponse(result);
    });
  },
);

route.get(
  "/managersEmployee/:id",
  authMiddleware,
  validate(EmployeesParamsSchema, "params"),
  async (req, res, next) => {
    errHandler(req, res, async () => {
      const { id } = req.params;
      const result = await managersEmployees(id);
      return successResponse(result);
    });
  },
);
//create employee with password
route.post(
  "/createEmployee",
  authMiddleware,
  validate(EmployeesBodySchema),
  async (req, res, next) => {
    errHandler(req, res, async () => {
      const { name, email, password } = req.body;
      const result = await createEmployee(name, email, password);
      console.log(result);
      return successResponse(result);
    });
  },
);

route.get(
  "/leavesOfEmployees",
  authMiddleware,
  validate(EmployeesQuerySchema),
  async (req, res, next) => {
    errHandler(req, res, async () => {
      const { page = 1, limit = 10 } = req.query;
      const { month } = req.body;
      const result = await allEmployeeLeavesPerMonth(month, page, limit);
      return successResponse(result);
    });
  },
);

//get employees
route.get(
  "/",
  authMiddleware,
  validate(EmployeesQuerySchema, "query"),
  async (req, res, next) => {
    //logger.info("Employees router hit");
    errHandler(req, res, async () => {
      //console.log("route hit")
      const { role, page = 1, limit = 10 } = req.query;
      const result = await getEmployees(role, page, limit);
      console.log(req.user);
      //logger.info("API's fetched successfully");
      return paginationResponse(result);
    });
  },
);

//get employee by id
route.get(
  "/:id",
  authMiddleware,
  validate(EmployeesParamsSchema, "params"),
  async (req, res, next) => {
    //logger.info("Employees router hit");
    errHandler(req, res, async () => {
      const { id } = req.params;
      console.log(req.query);
      console.log(req.params);
      const result = await getEmployeeById(id);
      //logger.info("API's fetched successfully");
      return successResponse(result);
    });
  },
);

//add employee
route.post(
  "/",
  authMiddleware,
  validate(EmployeesBodySchema),
  async (req, res, next) => {
    //logger.info("Employees router hit");
    errHandler(req, res, async () => {
      const { name, email } = req.body;
      const result = await postEmployee(name, email);
      //const  logger  = require('../config/logger');
      return successResponse(result);
    });
  },
);

//update employee
route.put(
  "/:id",
  authMiddleware,
  validate(EmployeesParamsSchema, "params"),
  validate(EmployeesBodySchema),
  async (req, res, next) => {
    //logger.info("Employees router hit");
    errHandler(req, res, async () => {
      const { id } = req.params;
      const { name, email } = req.body;
      const result = await updateEmployee(id, name, email);
      //const  logger  = require('../config/logger');
      return successResponse(result);
    });
  },
);

//delete employee
route.delete(
  "/:id",
  authMiddleware,
  validate(EmployeesParamsSchema, "params"),
  async (req, res, next) => {
    //logger.info("Employees router hit");
    errHandler(req, res, async () => {
      const { id } = req.params;
      const result = await deleteEmployee(id);
      //const  logger  = require('../config/logger');
      return successResponse(result);
    });
  },
);

module.exports = route;
