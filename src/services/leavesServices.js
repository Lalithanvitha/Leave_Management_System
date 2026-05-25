const express = require('express');
const route = express.Router();
const LeavesModel = require('../models/leavesModel');
const EmployeesModel = require('../models/employeesModel');
const RolesModel = require('../models/rolesModel');
const errHandler = require('../utils/errHandler');
const {successResponse} = require('../utils/responseHandler');
const {errorResponse} = require('../utils/responseHandler');
const {leaveStatus} = require('../helpers/enumHelper');
const {pagination} = require('../helpers/paginationHelper');
const {transaction} = require('objection');
const createError = require("http-errors");
const  logger  = require('../config/logger');
exports.createLeave = async(data)=>{  //function accepts request data
    logger.info("Leaves service hit");
    return await transaction(      //this starts transaction, trx = transaction object,every query using trx becomes the part of same database transaction
        LeavesModel.knex(),
            async(trx)=>{
                //console.log(leaveStatus);
                const employee = await EmployeesModel.query(trx).findById(data.emp_id);//find employee with given id
                                   // EmployeesModel.query(trx) means execute query inside the transaction
                //console.log(employee);                  
                if(!employee){         //if employee not found throw error
                    throw createError(404,"Employee not found");
                }
                const days =Number(data.days);
                //console.log(data.days);
                //console.log(typeof data.days);
                if(isNaN(days)){
                    throw createError(406,"Days must be a valid number");
                }
                if(employee.leave_balance < data.days){  //checks leave_balance ,if the condition becomes true,error is thrown
                    throw createError(400,"Insufficient balance");
                }
            //create leave request 
                const Leave = await LeavesModel.query(trx).insert({ //insert data into leaves table
                    emp_id:data.emp_id,
                    leavereason:data.leavereason,
                    from_date:data.from_date,
                    to_date:data.to_date,
                    days:data.days,
                    status:'PENDING'
                    });
                //console.log(Leave);
            //reduce leave_balance in employees table
                await EmployeesModel.query(trx)
                .where(
                  'id',
                  data.emp_id
                )
                .decrement(
                  'leave_balance',
                  data.days
                );
                return Leave;

            
            }   

        );
    
};
//get Employee's leaves
exports.getLeaveRequests = async(status,page,limit)=>{
    logger.info("Employees service hit");
    const result =  LeavesModel.query()
                       .select('*') 
                       .withGraphFetched("employees")
                       .modify((qb) => {
                         if(status) {
                            qb.where("status", status)
                         }
                       })

    const data = await pagination(result,page,limit);
    console.log(data);
    return data;
    
};

//get employee leave request by id
exports.getLeaveRequestById = async(id)=>{
    logger.info("Employees service hit");
    const result = await LeavesModel.query().findById(id);//fetch leave request of given id
    if(!result){
        throw createError(404,"Leave request not found");
    }
    return result;
};

//Add employee's leaves (post)
exports.addLeaveRequests = async(emp_id,leavereason,from_date,to_date,days)=>{
    logger.info("Employees service hit");
   if(!emp_id || !leavereason || !from_date || !to_date || !days){         //if emp_id,leavereason not mentioned, return error response
    throw createError(406,"All fields are required")
    }
    const result = await LeavesModel.query().insert({emp_id,leavereason,from_date,to_date,days});//else insert emp_id ,leavereason into the leaves table
    return result;
};
//Update employee's leave(put)
exports.updateLeaveRequest = async(id,emp_id,leavereason,from_date,to_date,days)=>{
    if(!emp_id && !leavereason && !from_date && !to_date && !days){ //if emp_id,leavereason not mentioned, return error response
        throw createError(406,"All fields are required")
    }
    const existingLeave = await LeavesModel.query().findById(id);//fetch a leave request with given id
    if(!existingLeave){//if no leave with given id was found return error response
        throw createError(404,"Leave not found");
    }
    const result = await LeavesModel.query().patchAndFetchById(id,{emp_id,leavereason,from_date,to_date,days});//add emp_id, leavereason to the given leaves id
    return result;
};

//delete employee's leave request
exports.deleteLeaveRequest = async(id)=>{
    logger.info("Employees service hit");
    const deletedLeaveRequest = await LeavesModel.query().deleteById(id).returning('*');//delete employee with given id and return the deleted object(leaves)
    if(!deletedLeaveRequest){
        throw createError(404,"Leave request not found");
    }
    return deletedLeaveRequest;
};





