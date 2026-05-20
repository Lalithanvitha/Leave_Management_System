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

//get roles
exports.getRoles = async(req,res,next)=>{
    const {page,limit,offset} = pagination(req.query.page , req.query.limit);
    const {role} = req.query;//fetching role from query params
    /*if(!role){//if role value is not present or incorrectly return ,throw error
        return errorResponse(
            res,//response
            "role is not found",//message
            404//status code
        );
    }*/
    if(role){//if role is correctly written
        const result = await RolesModel.query()//give 'employees.id','employees.name' joining employees and roles tables with role name from query params
                           .join('employees','roles.emp_id','employees.id')
                           .groupBy('employees.name','employees.id','roles.name')
                           .havingRaw(`roles.name = '${role}'`)
                           .select('employees.id','employees.name');
        console.log(result);//logging result value in terminal
        return successResponse(//success reponse ,these values goes into utils/responseHandler
            res,//response
            result,//data
            "Roles",//message
            200//status code
        )

    }
    const result = await RolesModel.query().limit(limit).offset(offset);//if page and limit mentioned in query, then get (limit) no.of values per page with calculated offset
    if(!result){//if no result return error response
        return errorResponse(
            res,//response
            "No roles found",//message
            404//status code
        );
    }
    return successResponse(//else return success response,these values goes into utils/responseHandler
        res,//response
        result,//data
        "Roles",//message
        200//status code
    ); 
};

//get roles by id
exports.getRolesById = async(req,res,next)=>{
    const id = req.params.id;
    if(!id){
        return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const result = await RolesModel.query().findById(id);
    if(!result){
        return errorResponse(
            res,
            `No role found with the given id:${id}`,
            404
        );
    }
    return successResponse(
        res,
        result,
        `Role with id ${id}`,
        200
    ); 
};
//post roles
exports.AddRole = async(req,res,next)=>{
    console.log("SERVICE EXECUTED");
    const {name,emp_id} = req.body;
    /*if(!name || !emp_id){
        return errorResponse(
            res,
            "Both name and emp_id are required",
            406
        );
    }*/

    const result = await RolesModel.query().insert({name,emp_id});
    return successResponse(
        res,
        result,
        "Created role",
        200
    ) 

};
//Update role
exports.UpdateRole = async(req,res,next)=>{
    const id = req.params.id;//fetch id from parameters
    if(!id){//if id is not mentioned or id mentioned is out of range, throw error response
        return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const {name,emp_id} = req.body;//get name,emp_id from request body
    if(!name || !emp_id){//if name or emp_id not mentioned throw error response
        return errorResponse(
            res,
            "name,emp_id are required",
            406
        );

    }
    const existingRole = await RolesModel.query().findById(id);//checking if an role exists with given id
    if(!existingRole){//if no role exists throw error response
        return errorResponse(
            res,
            "Role is not found",
             404
        );
    }

    const result = await RolesModel.query().patchAndFetchById(id,{name,emp_id});//add name,email and fetch the employee record by id
    return successResponse( //return success response to client (browser or postman)
        res,
        result,
        `Updated role with id: ${id}`,
         200
    );
};

//delete a role
exports.deleteRole = async(req,res,next)=>{
    const id = req.params.id;//get id from params
    if(!id){//if no id is mentioned or if id is out of range return error response
         return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const deletedRole = await RolesModel.query().deleteById(id).returning('*');//delete employee with given id and return the deleted object(role)
    if(!deletedRole){//if no role was found with given id return error response
        return errorResponse(
            res,
            "Role does not exist",
            404
        );
    }
    return successResponse(//else return success response 
        res,
        deletedRole,
        `Deleted role with id: ${id}`,
        200
    ); 
};

//accept or reject leave
exports.updateLeaveRequestByManager = async(req,res,next)=>{
    const {id} = req.params;//fetching id from request parameters
    if(!id){//if no id was found return error response
        return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const {idl,status} = req.body;//fetching idl(leaves.id),status(leaves.status) from request body
    if(!idl || !status){//if idl or status not mentioned, throw error response
        return errorResponse(
            res,
            "Both idl and status are required",
            406
        );
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
        return errorResponse(
            res,
            "Leave request not found",
            404
        );
    }
    if(leaveRequest.status === "PENDING"){//if leave request object's status is strictly equal to enum value of leave status
        const result = await LeavesModel.query()
                           .patchAndFetchById(idl,{status:status})//add status to the object with given id
        console.log(result);  //log result to console           
        return successResponse(//return success response,these values goes into utils/responseHandler
            res,
            result,
            "Updated leave request by manager",
            200
        );
    }else{
        return errorResponse(//else return error response
            res,
            "Leave request has already been processed",
            409
        );
            
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