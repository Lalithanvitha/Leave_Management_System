const express = require('express');
const route = express.Router();
const morgan = require('morgan');
const Emp = require('../models/employeesModel');
const Leave = require('../models/leavesModel');
const Role = require('../models/rolesModel');
const errHandler = require('../utils/errHandler');
const {successResponse} = require('../utils/responseHandler');
const {errorResponse} = require('../utils/responseHandler');
//Middleware
exports.middleware = (req,res,next)=>{
    console.log("Request received");
    next();
};
//Add employee
exports.postEmployee = errHandler(async(req,res,next)=>{
    try{
        
        const{name,email} = req.body;
        if(!name||!email){
            return errorResponse(
                res,
                "name,email fields are required",
                406
            );
        }

        const result = await Emp.query().insert({name,email});
        const employees  = await Emp.query();
        return successResponse(
            res,
            result,
            "Created an employee",
            201
        ) 
    }catch(err){
        next(err);
    }

});
//get employees
exports.getEmployees = errHandler(async(req,res,next)=>{
    try{
        const page = req.query.page || 1;
        const limit = req.query.limit || 15;

        if(page<1 || limit<1){
            return res.status(406).json({message:"page and limit should'nt be less than 1"})
        }
        const offset = (page - 1)*limit;
        const {role} = req.query;     
        if(role){
            const result = await Emp.query()
                       .join('roles','employees.id','roles.emp_id')
                       .groupBy('employees.id','roles.name')
                       .havingRaw(`roles.name = '${role}'`)
                       .select('employees.id','roles.name');
            console.log(result);
            return successResponse(
                res,
                result,
                `Employees with role ${role}`,
                200
        );
        }else{
            const employees = await Emp.query().limit(limit).offset(offset);
            return successResponse(
                res,
                employees,
                "Employees",
                200
            );
        }
        

    }catch(err){
        next(err);
    }

});
//get employee by id
exports.getEmployeeById = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const result = await Emp.query().findById(id);
        if(!result){
            return errorResponse(
                res,
                "No employees found",
                404
            );
        }
        return successResponse(
            res,
            result,
            "Employee",
            200
        );

    }catch(err){
        next(err);
    }

});
//update employee
exports.updateEmployee = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const {name,email} = req.body;
        if(!name&&!email){
            return errorResponse(
                res,
                "name,email any one field is required",
                406
            );
        }
        const existingUser = await Emp.query().findById(id);
        if(!existingUser){
            return errorResponse(
                res,
                "User not found",
                404
            );
            
        }
        const duplicate = await Emp.query()
                          .where(builder=>{
                          if (name) {
                            builder.where('name', name);
                          }

                          if (email) {
                            builder.orWhere('email', email);
                          }
                          })
                          .whereNot('id',id);
        if(duplicate.length>0){
            return errorResponse(
                res,
                "name,email already exists",
                409
            );
        }
        const result = await Emp.query().patchAndFetchById(id,{name,email});
        const employees  = await Emp.query();
        return successResponse(
            res,
            result,
            `Updated employee with id: ${id}`,
            200
        );
    }catch(err){
        next(err);
    }

});

exports.deleteEmployee = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const result = await Emp.query().deleteById(id).returning('*');
        if(!result){
            return errorResponse(
                res,
                `Employee with given id ${id} not found`,
                404
            );

        }
        const remEmployees = await Emp.query();
        return successResponse(
            res,
            result,
            `Deleted employee with id: ${id}`,
            200
        );
    }catch(err){
       next(err);
    }

});







