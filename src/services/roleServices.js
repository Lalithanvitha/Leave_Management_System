const express = require('express');
const route = express.Router();
const morgan = require('morgan');
const EmployeesModel = require('../models/employeesModel');
const LeavesModel = require('../models/leavesModel');
const RolesModel = require('../models/rolesModel');
const errHandler = require('../utils/errHandler');
const {successResponse} = require('../utils/responseHandler');
const {errorResponse} = require('../utils/responseHandler');
const {leaveStatus} = require('../helpers/enumHelper');
const {pagination} = require('../helpers/paginationHelper');
const createError = require("http-errors");
const  logger  = require('../config/logger');
//get roles
exports.getRoles = async(emp_id,page,limit)=>{
        logger.info("Roles service hit");
        /*console.log(emp_id);
        console.log(page);
        console.log(limit);*/
        const result =  RolesModel.query()//give 'employees.id','employees.name' joining employees and roles tables with role name from query params
                           .select('*')
                           .withGraphFetched("employees")
                           .modify((qb)=>{
                            if(emp_id){
                                qb.where("emp_id",emp_id);
                            }
                           })
                           
        //console.log("==================",result);                  
        const data = await pagination(result,page,limit);
        //console.log("-------",data);
        return data;

    
};

//get roles by id
exports.getRolesById = async(id)=>{
    logger.info("Roles service hit");
    const result = await RolesModel.query().findById(id);
    if(!result){
        throw createError(404,"Role not found");
    }
    return result;

};
//post roles
exports.AddRole = async(name,emp_id)=>{
    logger.info("Roles service hit");
    if(!name || !emp_id){
        throw createError(406,"Both name and emp_id are required");
    }
    const result = await RolesModel.query().insert({name,emp_id});
    return result;

};
//Update role
exports.UpdateRole = async(id,name,emp_id)=>{
    logger.info("Roles service hit");
    if(!name || !emp_id){//if name or emp_id not mentioned throw error response
        throw createError(406,"Both name an emp_id are required");

    }
    const existingRole = await RolesModel.query().findById(id);//checking if an role exists with given id
    if(!existingRole){//if no role exists throw error response
        throw createError(404,"Role not found");
    }
    const result = await RolesModel.query().patchAndFetchById(id,{name,emp_id});//add name,email and fetch the employee record by id
    return result;
};

//delete a role
exports.deleteRole = async(id)=>{
    logger.info("Roles service hit");
    const deletedRole = await RolesModel.query().deleteById(id).returning('*');//delete employee with given id and return the deleted object(role)
    if(!deletedRole){//if no role was found with given id return error response
        throw createError(404,"role does not exist");
    }
    return deletedRole;

};

//accept or reject leave
exports.updateLeaveRequestByManager = async(id,idl,status)=>{
    logger.info("Roles service hit");
    if(!idl || !status){//if idl or status not mentioned, throw error response
        throw createError(406,"Both idl and status are required");
    }
    const obj = await RolesModel.query().findById(id);//fetch roles object with given id
    if(obj.name !== "MANAGER"){//if role name is strictly NOT equal to "MANAGER" throw error response
        return errorResponse(
            res,
            "Access denied",
            403
        );
    }
    const leaveRequest = await LeavesModel.query().findById(idl);//fetch leave request by given id
    console.log(leaveRequest);//log leave request in console
    console.log(leaveRequest.status);//log leave request status in console
    if(!leaveRequest){//if leave request was not found return error response
        throw createError(404,"Leave request ot found");
    }
    if(leaveRequest.status === "PENDING"){//if leave request object's status is strictly equal to enum value of leave status
        const result = await LeavesModel.query()
                           .patchAndFetchById(idl,{status:status})//add status to the object with given id
        console.log(result);  //log result to console   
        return result;        
    }
};

/*const statusArr = await Role.query()
                       .join('employees','roles.emp_id','employees.id')
                       .join('leaves','employees.id','leaves.emp_id')
                       .groupBy('status','leaves.id')
                       .havingRaw(`leaves.id = ${idl}`)
                       .select('status');
        const status1 = statusArr.map(s=>s.status);
        console.log(status1);*/
        
        /*const status1 = {};
        statusArr.forEach(s=>{
            status1[s.status] = s
        })
        console.log(status1);*/
            // select * from leaves update leaves set status='Approved' where id =idl;
            /*const result = await Role.query()
                       .join('employees','roles.emp_id','employees.id')
                       .join('leaves','employees.id','leaves.emp_id')
                       .groupBy('status','leaves.id')
                       .havingRaw(`leaves.id = ${idl}`)
                       
                       .patchAndFetchById(idl,Status);*/