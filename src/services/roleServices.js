const express = require("express");
const route = express.Router();
const morgan = require("morgan");
const EmployeesModel = require("../models/employeesModel");
const LeavesModel = require("../models/leavesModel");
const RolesModel = require("../models/rolesModel");
const errHandler = require("../utils/errHandler");
const { successResponse } = require("../utils/responseHandler");
const { errorResponse } = require("../utils/responseHandler");
const { leaveStatus } = require("../helpers/enumHelper");
const { pagination } = require("../helpers/paginationHelper");
const createError = require("http-errors");
const logger = require("../config/logger");
const { transaction } = require("objection");
const authMiddleware = require("../utils/authMiddleware");
const { sendLeaveStatusMail } = require("../utils/mail");
const leaveEmitter = require("../utils/leaveMailEvent");
//get roles
exports.getRoles = async (emp_id, page, limit) => {
  logger.info("Roles service hit");
  const result = RolesModel.query() //give 'employees.id','employees.name' joining employees and roles tables with role name from query params
    .select("*")
    .withGraphFetched("employees")
    .modify((qb) => {
      if (emp_id) {
        qb.where("emp_id", emp_id);
      }
    });

  //console.log("==================",result);
  const data = await pagination(result, page, limit);
  //console.log("-------",data);
  return data;
};

//get roles by id
exports.getRolesById = async (id) => {
  logger.info("Roles service hit");
  const result = await RolesModel.query().findById(id);
  if (!result) {
    throw createError(404, "Role not found");
  }
  return result;
};
//post roles
exports.AddRole = async (name, emp_id) => {
  logger.info("Roles service hit");
  if (!name || !emp_id) {
    throw createError(406, "Both name and emp_id are required");
  }
  const result = await RolesModel.query().insert({ name, emp_id });
  return result;
};
//Update role
exports.UpdateRole = async (id, name, emp_id) => {
  logger.info("Roles service hit");
  if (!name || !emp_id) {
    //if name or emp_id not mentioned throw error response
    throw createError(406, "Both name an emp_id are required");
  }
  const existingRole = await RolesModel.query().findById(id); //checking if an role exists with given id
  if (!existingRole) {
    //if no role exists throw error response
    throw createError(404, "Role not found");
  }
  const result = await RolesModel.query().patchAndFetchById(id, {
    name,
    emp_id,
  }); //add name,email and fetch the employee record by id
  return result;
};

//delete a role
exports.deleteRole = async (id) => {
  logger.info("Roles service hit");
  const deletedRole = await RolesModel.query().deleteById(id).returning("*"); //delete employee with given id and return the deleted object(role)
  if (!deletedRole) {
    //if no role was found with given id return error response
    throw createError(404, "role does not exist");
  }
  return deletedRole;
};

//updateLeaveRequestByManager (using transaction)
exports.updateLeaveRequestByManager = async (id, idl, status) => {
  logger.info("Roles service hit");
  const trx = await LeavesModel.startTransaction();
  try {
    // Validate inputs
    if (!idl || !status) {
      throw createError(406, "Both idl and status are required");
    }
    // Validate status value
    const allowedStatus = ["APPROVED", "REJECTED"];
    if (!allowedStatus.includes(status)) {
      throw createError(400, "Invalid status");
    }
    // Fetch leave request
    const leave = await LeavesModel.query(trx).findById(idl);
    console.log(leave);
    if (!leave) {
      throw createError(404, "Leave request not found");
    }
    const employee = await EmployeesModel.query(trx).findById(leave.emp_id);
    const manager = await EmployeesModel.query(trx).findById(id);
    console.log(manager);
    console.log(employee);
    if (!employee) {
      throw createError(404, "Employee not found");
    }
    // Check manager role
    if (employee.manager_id !== id) {
      throw createError(403, "Access denied");
    }
    // Prevent updating again
    if (leave.status !== "PENDING") {
      throw createError(400, "Leave already processed");
    }
    // APPROVED → deduct balance
    if (status === "APPROVED") {
      // Check balance
      if (employee.leave_balance < leave.days) {
        throw createError(400, "Insufficient leave balance");
      }
      // Deduct balance
      await EmployeesModel.query(trx)
        .findById(leave.emp_id)
        .decrement("leave_balance", leave.days);
    }
    // Update leave status
    const result = await LeavesModel.query(trx).patchAndFetchById(idl, {
      status: status,
    });
    const from_date = leave.from_date.toDateString();
    const to_date = leave.to_date.toDateString();
    // COMMIT transaction
    await trx.commit();
    leaveEmitter.emit("leaveStatusMail", {
      employee,
      from_date,
      to_date,
      manager,
      status,
      idl,
    });
    await LeavesModel.query().findById(idl).patch({ email_sent: true });
    const updatedLeave = await LeavesModel.query().findById(idl);
    return updatedLeave;
  } catch (err) {
    // ROLLBACK transaction
    await trx.rollback();
    logger.error(err.message);
    throw err;
  }
};
