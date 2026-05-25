const express = require ('express');
const route = express.Router();
const morgan = require('morgan');
const EmployeesModel = require('../models/employeesModel');
const LeavesModel = require('../models/leavesModel');
const RolesModel = require('../models/rolesModel');
const errHandler = require('../utils/errHandler');
const {successResponse} = require('../utils/responseHandler');
const {errorResponse} = require('../utils/responseHandler');
const {pagination} = require('../helpers/paginationHelper');
const {leaveStatus} = require('../helpers/enumHelper');
const createError = require("http-errors");
const  logger  = require('../config/logger');

//Middleware
exports.middleware = (req,res,next)=>{
    console.log("Request received");
    next();
};
//Add employee
exports.postEmployee = async(name,email)=>{
    logger.info("Employees service hit");
    if(!name||!email){ //if name and email not mentioned in the body,throws error
        throw createError(406,"Both name and email fields are required");
    }

    const result = await EmployeesModel.query().insert({name,email});//Inserts name and email from request body into employees table
    return result;

};
//get employees
exports.getEmployees = async(role,page,limit)=>{
    logger.info("Employees service hit");
    //console.log(role);
    const result =  EmployeesModel.query()
                       .select('*') 
                       .withGraphFetched("roles")
                       .modifyGraph("roles", (qb) => {
                         if(role) {
                            qb.where("name", role)
                         }
                       })
    const data = await pagination(result,page,limit);
    return data;  
        
}

//get employee by id
exports.getEmployeeById = async(id)=>{
    logger.info("Employees service hit");
    const result = await EmployeesModel.query().findById(id);//fetch all columns from the employees table with given id
    if(!result){//if no employee found with given id , throw error
        throw createError(404,"Employee not found");
    }
    return result;


};

//update employee
exports.updateEmployee = async(id,name,email)=>{
    logger.info("Employees service hit");
    if(!name&&!email){//if name and email are not mentioned throw an error
        throw createError(406,"name,email any one field is required");
    }
    const existingUser = await EmployeesModel.query().findById(id);//checking if an employee exists with given id
    if(!existingUser){//if there is no employee with given id ,throw an error
        throw createError(404,"Employee not found");         
    }
    const duplicate = await EmployeesModel.query()//to find a duplicate employee 
                          .where(builder=>{//using builder(object) used to combine queries
                          if (name) {
                            builder.where('name', name);
                          }

                          if (email) {
                            builder.orWhere('email', email);
                          }
                          })
                          .whereNot('id',id);//if given name or email found with different id ,then name or email can be duplicate
    if(duplicate.length>0){//as duplicate returns array, if duplicate array length is greater than zero throw an error
        throw createError(409,"name,email alread exists");
    }
    const result = await EmployeesModel.query().patchAndFetchById(id,{name,email});//add name,email and fetch the employee record by id
    return result;
 

};

//delete an employee
exports.deleteEmployee = async(id)=>{
    logger.info("Employees service hit");
    const result = await EmployeesModel.query().deleteById(id).returning('*');//delete employee with given id and return the deleted object(employee)
    if(!result){//if no employee was found with given id return error response
        throw createError(404,`Employee with given id ${id} not found`,);
    }
    return result;
}


/*const result =  EmployeesModel.query()
                       .join("roles","employees.id","roles.emp_id")
                       .groupBy("employees.id","roles.id")
                       .havingRaw(`roles.name = '${role}'`)
                       .select('*') ;*/