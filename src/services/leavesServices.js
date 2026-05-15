const express = require('express');
const route = express.Router();
const Leave = require('../models/leavesModel');
const Emp = require('../models/employeesModel');
const Role = require('../models/rolesModel');
const errHandler = require('../utils/errHandler');
const {successResponse} = require('../utils/responseHandler');
const {errorResponse} = require('../utils/responseHandler');
//get Employee's leaves
exports.getLeaveRequests = errHandler(async(req,res,next)=>{
    try{
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        if(page<1 || limit<1){
            res.status(406).json({message:"page and limit should'nt be less than 1"});
        }
        const offset = (page -1)*limit;
        const {status} = req.query;
        if(status){
            const result = await Leave.query().where('status',status);
            console.log(result);
            return successResponse(
                res,
                result,
                "Leaves",
                200
            ); 

        }else{
            const result = await Leave.query().limit(limit).offset(offset);
            const total = await Leave.query().resultSize(); //fetches no.of records in the table(length gives no.of records fetched)
            return successResponse(
                    res,
                    {result,
                     total,
                    },
                    "Leaves",
                    200
                ); 

        }
    

    }catch(err){
        next(err);
    }
});

//get employee leave request by id
exports.getLeaveRequestById = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;

        const result = await Leave.query().findById(id);
        if(!result){
            return errorResponse(
                res,
                `Leave with given id ${id} is not found`,
                404
            );
        }
        return successResponse(
            res,
            result,
            `Leave request of employee with id ${id}`,
            200
        ) 
    }catch(err){
       next(err);
    }
});

//Add employee's leaves (post)
exports.addLeaveRequests = errHandler(async(req,res,next)=>{
    try{
        const {emp_id,leavereason} = req.body;
        if(!emp_id || !leavereason){
            return errorResponse(
                res,
                "emp_id and leave (reason) are required ",
                406
            );
        }
        const result = await Leave.query().insert({emp_id,leavereason});
        return successResponse(
            res,
            result,
            "Leaves",
            200
        ) 
        
    }catch(err){
        next(err);
    }


});
//Update employee's leave(put)
exports.updateLeaveRequest = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const {emp_id,leavereason} = req.body;
        if(!emp_id || !leavereason){
            return errorResponse(
                res,
                "Both emp_id and leave reason are required",
                406
            );
        }
        const existingEmp = await Leave.query().findById(id);
        if(!existingEmp){
            return errorResponse(
                res,
                "Employee has not applied for any leave ",
                404
            );
        }
        const result = await Leave.query().patchAndFetchById(id,{emp_id,leavereason});
        return successResponse(
            res,
            result,
            "Updated employee's leave request",
            200
        ) 
        
    }catch(err){
        next(err);
    }
});

//delete employee's leave request
exports.deleteLeaveRequest = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const deletedLeaveRequest = await Leave.query().deleteById(id).returning('*');
        if(!deletedLeaveRequest){
            return errorResponse(
                res,
                "Leave request not found",
                404
            );

        }
        return successResponse(
            res,
            result,
            `Deleted leave request with id :${id}`,
            200
        ) 
    }catch(err){
        next(err);
    }
});





