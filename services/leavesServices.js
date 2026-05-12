const express = require('express');
const route = express.Router();
const Leave = require('../models/leaves');
const Emp = require('../models/employees');
const errHandler = require('../utils/errHandler');
//get Employee's leaves
exports.getLeaveRequests = errHandler(async(req,res,next)=>{
    try{
        const result = await Leave.query();

        res.json({
            message:"Leaves",
            result
        })
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
            throw new Error("User not found");
        }
        res.json({
            message:"Get employee leave by id",
            result
        })
    }catch(err){
       next(err);
    }
});

//Add employee's leaves (post)
exports.addLeaveRequests = errHandler(async(req,res,next)=>{
    try{
        const {emp_id,leavereason} = req.body;
        if(!emp_id || !leavereason){
            throw new Error("emp_id and leave (reason) are required ");
        }
        const result = await Leave.query().insert({emp_id,leavereason});
        res.json({
            message:"Leaves",
            result
        })
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
            throw new Error("Both emp_id and leave reason are required");
        }
        const existingEmp = await Leave.query().findById(id);
        if(!existingEmp){
            throw new Error("Employee has not applied for any leave ");
        }
        const result = await Leave.query().patchAndFetchById(id,{emp_id,leavereason});
        res.json({
            message:"Updated employee's leave request",
            result
        })
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
            throw new Error("Leave request not found");
        }
        res.json({
            message:`Deleted leave request with id :${id}`,
            deletedLeaveRequest
        })
    }catch(err){
        next(err);
    }
});

/*route.update('/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const{role} = req.body;
        if(role === "Manager"){
            const accept = await Leave.query()
        }
    }
})*/


//module.exports = route;