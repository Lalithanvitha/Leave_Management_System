const express = require('express');
const route = express.Router();
const morgan = require('morgan');
const Emp = require('../models/employeesModel');
const Leave = require('../models/leavesModel');
const Role = require('../models/rolesModel');
const errHandler = require('../utils/errHandler');
const {successResponse} = require('../utils/responseHandler');
const {errorResponse} = require('../utils/responseHandler');

//get roles
exports.getRoles = errHandler(async(req,res,next)=>{
    try{
        const {page=1, limit=10} = req.query;
        if(page<1 || limit<1){
            res.status(406).json({message:"page and limit should'nt be less than 1"});
        }
        const offset = (page - 1)*limit;
        const {role} = req.query;
        if(role){
            const result = await Role.query()
                           .join('employees','roles.emp_id','employees.id')
                           .groupBy('employees.name','employees.id','roles.name')
                           .havingRaw(`roles.name = '${role}'`)
                           .select('employees.id','employees.name');
            console.log(result);
            return successResponse(
                res,
                result,
                "Roles",
                200
            )

        }
        const result = await Role.query().limit(limit).offset(offset);
        if(!result){
            return errorResponse(
                res,
                "No roles found",
                404
            );
        }
        return successResponse(
            res,
            result,
            "Roles",
            200
        ) 


    }catch(err){
        next(err);
    }
})

//get roles by id
exports.getRolesById = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const result = await Role.query().findById(id);
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
        ) 
    }catch(err){
        next(err);
    }
});
//post roles
exports.AddRole = errHandler(async(req,res,next)=>{
    try{
        const {name,emp_id} = req.body;
        if(!name || !emp_id){
            return errorResponse(
                res,
                "Both name and emp_id are required",
                406
            );
        }

        const result = await Role.query().insert({name,emp_id});
        return successResponse(
            res,
            result,
            "Created role",
            200
        ) 

    }catch(err){
        next(err);
    }
})
//Update role
exports.UpdateRole = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const {name,emp_id} = req.body;
        if(!name || !emp_id){
            return errorResponse(
                res,
                "name or emp_id atleast one field is required",
                406
            );

        }
        const existingRole = await Role.query().findById(id);
        if(!existingRole){
            return errorResponse(
                res,
                "Role is not found",
                404
            );
        }

        const result = await Role.query().findById(id).patchAndFetchById(id,{name,emp_id});
        return successResponse(
            res,
            result,
            `Updated role with id: ${id}`,
            200
        )
    }catch(err){
        next(err);
    }
});

//delete a role
exports.deleteRole = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const deletedRole = await Role.query().deleteById(id).returning('*');
        if(!deletedRole){
            return errorResponse(
                res,
                "Role does not exist",
                404
            );
        }
        return successResponse(
            res,
            result,
            `Deleted role with id: ${id}`,
            200
        ) 

    }catch(err){
        next(err);
    }
});

//accept or reject leave
exports.updateLeaveRequestByManager = errHandler(async(req,res,next)=>{
    try{
        const {id} = req.params;
        const {idl,status} = req.body;
        const obj = await Role.query().findById(id);
        if(obj.name !== "MANAGER"){
            return errorResponse(
                res,
                "Access denied",
                403
            );
        }
        const leaveRequest = await Leave.query().findById(idl);
        console.log(leaveRequest);
        console.log(leaveRequest.status);
        if(!leaveRequest){
            return errorResponse(
                res,
                "Leave request not found",
                404
            );
        }
        if(leaveRequest.status === "pending"){
            const result = await Leave.query()
                           .patchAndFetchById(idl,{status:status})
            console.log(result);             
            return successResponse(
                res,
                result,
                "Updated leave request by manager",
                200
            );
        }else{
            return errorResponse(
                res,
                "Leave request has already been processed",
                409
            );
            
        }
    }catch(err){
        next(err);
    }
});

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