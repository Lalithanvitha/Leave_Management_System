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

//Middleware
exports.middleware = (req,res,next)=>{
    console.log("Request received");
    next();
};
//Add employee
exports.postEmployee = async(req,res,next)=>{
    const{name,email} = req.body; //Extracting name,email from request body
    if(!name||!email){ //if name and email not mentioned in the body,throws error
        return errorResponse(
                res,//response
                "name,email fields are required",//message
                406//status code
        );
    }

    const result = await EmployeesModel.query().insert({name,email});//Inserts name and email from request body into employees table
    const employees  = await EmployeesModel.query();//Fetches all employees from the employees table
    return successResponse(//success reponse ,these values goes into utils/responseHandler
        res,//response
        result,//data
        "Created an employee",//message
        201//status code
    );
};
//get employees
exports.getEmployees = async(req,res,next)=>{
    const {page,limit,offset} = pagination(req.query.page , req.query.limit);
    const {role} = req.query;       //fetching value of role from query
    /*if(!role){                      //if role value is not present or incorrectly return ,throw error
        return errorResponse(
            res,
            "role is not found",
            404
        );
    }  */   
    if(role){//if role is correctly written
        const result = await EmployeesModel.query()//give result joining employees and roles tables 
                       .join('roles','employees.id','roles.emp_id')
                       .groupBy('employees.id','roles.name')
                       .havingRaw(`roles.name = '${role}'`)
                       .select('employees.id','roles.name');
        console.log(result);//logging result value in terminal
        return successResponse(//success reponse ,these values goes into utils/responseHandler
            res,
            result,
            `Employees with role ${role}`,
             200
        );
        }else{
        const employees = await EmployeesModel.query().limit(limit).offset(offset);//if page and limit mentioned in query, then get (limit) no.of values per page with calculated offset
        if(!employees){//if no employees return error response
            return errorResponse(
                res,
                "No roles found",
                404
            );
        }
        return successResponse(//else return success response,these values goes into utils/responseHandler
            res,
            employees,
            "Employees",
            200
        );
    }

};
//get employee by id
exports.getEmployeeById = async(req,res,next)=>{
    const id = req.params.id;//fetch id from parameters
    if(!id){//if id is not mentioned or id mentioned is out of range, throw error response
        return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const result = await EmployeesModel.query().findById(id);//fetch all columns from the employees table with given id
    if(!result){//if no employee found with given id , throw error
        return errorResponse(
            res,
            "No employees found",
            404
        );
    }
    return successResponse(//else give success response
        res,
        result,
        "Employee",
        200
    );


};
//update employee
exports.updateEmployee = async(req,res,next)=>{
    const id = req.params.id;//fetch id from parameters
    if(!id){//if id is not mentioned or id mentioned is out of range, throw error response
        return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const {name,email} = req.body;//getting name , email from request body
    if(!name&&!email){//if name and email are not mentioned throw an error
        return errorResponse(
            res,
            "name,email any one field is required",
            406
        );
    }
    const existingUser = await EmployeesModel.query().findById(id);//checking if an employee exists with given id
    if(!existingUser){//if there is no employee with given id ,throw an error
        return errorResponse(
            res,
            "User not found",
            404
        );
            
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
            return errorResponse(
                res,
                "name,email already exists",
                409
            );
    }
    const result = await EmployeesModel.query().patchAndFetchById(id,{name,email});//add name,email and fetch the employee record by id
    const employees  = await EmployeesModel.query();//fetch all records from the table
    return successResponse(//return success response to client (browser or postman)
            res,
            result,
            `Updated employee with id: ${id}`,
            200
    );

};
//delete an employee
exports.deleteEmployee = async(req,res,next)=>{
    const id = req.params.id;//get id from params
    if(!id){//if no id is mentioned or if id is out of range return error response
        return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const result = await EmployeesModel.query().deleteById(id).returning('*');//delete employee with given id and return the deleted object(employee)
    if(!result){//if no employee was found with given id return error response
        return errorResponse(
            res,
            `Employee with given id ${id} not found`,
            404
        );

    }
    const remEmployees = await EmployeesModel.query();//fetch all records from Employees Model
    return successResponse(
        res,
        result,
        `Deleted employee with id: ${id}`,
        200
    );
};







