const express = require('express');
const route = express.Router();
const Leave = require('../models/leaves');
const Emp = require('../models/employees');
const Role = require('../models/roles');
const errHandler = require('../utils/errHandler');
//get Employee's leaves
exports.getLeaveRequests = errHandler(async(req,res,next)=>{
    try{
        const result = await Leave.query();
        if(!result){
            throw new Error("No leaves found");
        }

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
            throw new Error(`Leave with given id ${id} is not found`);
        }
        res.json({
            message:`Leave request of employee with id ${id}`,
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

/*exports.updateLeaveRequestByManager = errHandler(async(req,res,next)=>{
    try{
        const {id,role} = req.params;
        const {status} = req.body;
        const leaveRequest = await Leave.query().findById(id);
        if(!leaveRequest){
            throw new Error("Leave request not found");
        }
        if(role !== "MANAGER"){
            throw new Error("Access denied");
        }
        const leaveStatus = await Leave.query().findById(id).where('status','pending');
        if(!leaveStatus){
            throw new Error("Leave request has already been processed");
            
        }else{
            const result = await Leave.query().findById(id).patchAndFetchById(id,{status});
            res.json({
                message:"Updated leave request by manager",
                result
            })
        }
    }catch(err){
        next(err);
    }
});*/
/*
//accept or reject leave
exports.updateLeaveRequestByManager = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const {idl,status} = req.body;
        const obj = await Role.query().findById(idr);
        if(obj.name !== "MANAGER"){
            throw new Error("Access denied");
        }
        const leaveRequest = await Leave.query().findById(id);
        console.log(leaveRequest);
        console.log(leaveRequest.status);
        if(!leaveRequest){
            throw new Error("Leave request not found");
        }
        if(leaveRequest.status === "pending"){
            
            const result = await Leave.query().findById(id).patchAndFetchById(id,status);
            /*const result = await Role.query()
                       .join('employees','roles.emp_id','employees.id')
                       .join('leaves','employees.id','leaves.emp_id')
                       .groupBy('status','leaves.id')
                       .havingRaw(`leaves.id = ${idl}`)
                       
                       .patchAndFetchById(idl,Status);//
            console.log(result);
                     
            res.json({
                message:"Updated leave request by manager",
                result
            })
        }else{
            throw new Error("Leave request has already been processed");
            
        }
    }catch(err){
        next(err);
    }
});*/



