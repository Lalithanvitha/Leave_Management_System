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
exports.createLeave = async(req,res,next)=>{  //function accepts request data
    return await transaction(      //this starts transaction, trx = transaction object,every query using trx becomes the part of same database transaction
        LeavesModel.knex(),
            async(trx)=>{
                const data = req.body;
                console.log(leaveStatus);
                const employee = await EmployeesModel.query(trx).findById(data.emp_id);//find employee with given id
                                   // EmployeesModel.query(trx) means execute query inside the transaction
                if(!employee){         //if employee not found throw error
                    return errorResponse(
                        res,//response
                        "Employee not found",//message
                        404//status code
                    );
                }
                const days =Number(data.days);
                console.log(data.days);
                console.log(typeof data.days);
                if(isNaN(days)){
                    throw new Error('Days must be a valid number');
                }
                if(employee.leave_balance < data.days){  //checks leave_balance ,if the condition becomes true,error is thrown
                    return errorResponse(
                        res,//response
                        "Insufficient balance",//message
                        400//status code
                    );
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
            
                return successResponse( //if leave request with given status is found ,return success response,these values goes into utils/responseHandler
                    res,//response
                    Leave,//data
                    "Leave request created successfully",//message
                    201//status code
            );  
            
            }   

        );
    
};
//get Employee's leaves
exports.getLeaveRequests = async(req,res,next)=>{
    console.log(leaveStatus);
    const {page,limit,offset} = pagination(req.query.page , req.query.limit);
    const {status} = req.query; //fetching value of status(leave) from query
    /*if(!status){ //if status is not found or written incorrectly, return error response
        return errorResponse(
            res,//response
            "status not found",//message
            404//status code
        );
    }*/
    if(status){//if status id defined
        const result = await LeavesModel.query().where('status',status);//get the leave request with defined status
        console.log(result);//log the result
        return successResponse( //if leave request with given status is found ,return success response,these values goes into utils/responseHandler
            res,//response
            result,//data
            "Leaves",//message
            200//status code
        ); 

    }else{
        const result = await LeavesModel.query().limit(limit).offset(offset);//fetch leave requests with given limit and offset per page
        const total = await LeavesModel.query().resultSize(); //fetches no.of records in the table(length gives no.of records fetched)
        return successResponse(//these success and error responses will direct to errHandler from utils folder
            res,      //response
            {result,
            total,     //data
            },
            "Leaves",   //message
            200         //status code
        ); 

        }
    
};

//get employee leave request by id
exports.getLeaveRequestById = async(req,res,next)=>{
    const id = req.params.id;//get id from params
    if(!id){                 //if no id is mentioned or if id is out of range return error response
        return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const result = await LeavesModel.query().findById(id);//fetch leave request of given id
    if(!result){            //if no request found with given id ,return error response
        return errorResponse(
            res,
            `Leave with given id ${id} is not found`,
            404
        );
    }
    return successResponse(//else return success response
        res,
        result,
        `Leave request of employee with id ${id}`,
        200
    ); 
};

//Add employee's leaves (post)
exports.addLeaveRequests = async(req,res,next)=>{
    const {emp_id,leavereason} = req.body;//fetching emp_id and leavereason from request body
    if(!emp_id || !leavereason){         //if emp_id,leavereason not mentioned, return error response
        return errorResponse(
            res,
            "emp_id and leave (reason) are required ",
            406
        );
    }
    const result = await LeavesModel.query().insert({emp_id,leavereason});//else insert emp_id ,leavereason into the leaves table
    return successResponse( 
        res,
        result,
        "Leaves",
        200
    ); 
};
//Update employee's leave(put)
exports.updateLeaveRequest = async(req,res,next)=>{
    const id = req.params.id;//get id from params
    if(!id){                 //if no id is mentioned or if id is out of range return error response
        return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const {emp_id,leavereason} = req.body;//fetching emp_id and leavereason from request body
    if(!emp_id || !leavereason){ //if emp_id,leavereason not mentioned, return error response
        return errorResponse(
            res,
            "Both emp_id and leave reason are required",
            406
        );
    }
    const existingLeave = await LeavesModel.query().findById(id);//fetch a leave request with given id
    if(!existingLeave){//if no leave with given id was found return error response
        return errorResponse(
            res,
            "Employee has not applied for any leave ",
            404
        );
    }
    const result = await LeavesModel.query().patchAndFetchById(id,{emp_id,leavereason});//add emp_id, leavereason to the given leaves id
    return successResponse(//if added return success response
        res,
        result,
        "Updated employee's leave request",
        200
    ); 
};

//delete employee's leave request
exports.deleteLeaveRequest = async(req,res,next)=>{
    const id = req.params.id;//get id from params
    if(!id){                 //if no id is mentioned or if id is out of range return error response
        return errorResponse(
            res,
            `id:${id} is not found`,
            404
        );
    }
    const deletedLeaveRequest = await LeavesModel.query().deleteById(id).returning('*');//delete employee with given id and return the deleted object(leaves)
    if(!deletedLeaveRequest){//if no leave request was found with given id return error response
        return errorResponse(
            res,
            "Leave request not found",
            404
        );

    }
    return successResponse(
        res,
        deletedLeaveRequest,
        `Deleted leave request with id :${id}`,
        200
    ); 
};





