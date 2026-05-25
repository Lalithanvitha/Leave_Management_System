const express = require('express');
const route = express.Router();
//const wrapRoutes = require('../utils/wrapRoutes');
//const leavesServices = require('../services/leavesServices');
const { getLeaveRequests, getLeaveRequestById, addLeaveRequests, updateLeaveRequest, deleteLeaveRequest,createLeave} = require('../services/leavesServices');
const errHandler = require('../utils/errHandler');
const { successResponse } = require('../utils/responseHandler');
const { errorResponse } = require('../utils/responseHandler');
const {pagination} = require('../helpers/paginationHelper');
const  logger  = require('../config/logger');
const {LeavesSchema} = require('../validations/LeavesSchema');
const validate = require( '../utils/validate');

route.get('/',
    async(req,res,next)=>{
        logger.info("Leaves router hit");
        errHandler(req,res,async()=>{
            const {status,page=1,limit=10} = req.query; 
            const result = await getLeaveRequests(status,page,limit);
            logger.info("API's fetched successfully");
            return successResponse(result);
        })
    }
);
route.get('/:id',
    async(req,res,next)=>{
        logger.info("Leaves router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            const result = await getLeaveRequestById(id);
            logger.info("API's fetched successfully");
            return successResponse(result);
        })
    }
);
route.post('/',validate(LeavesSchema),
    async(req,res,next)=>{
        logger.info("Leaves router hit");
        errHandler(req,res,async()=>{
            const {emp_id,leavereason,from_date,to_date,days} = req.body;
            console.log(req.body);
            const result = await addLeaveRequests(emp_id,leavereason,from_date,to_date,days);
            logger.info("API's fetched successfully");
            return successResponse(result);
        });
    }
);
route.put('/:id',
    async(req,res,next)=>{
        logger.info("Leaves router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            const {emp_id,leavereason} = req.body;
            const result = await updateLeaveRequest(id,emp_id,leavereason);
            logger.info("API's fetched successfully");
            return successResponse(result);
        });
    }
);
route.delete('/:id',
    async(req,res,next)=>{
        logger.info("Leaves router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            const result = await deleteLeaveRequest(id);
            logger.info("API's fetched successfully");
            return successResponse(result);
        })
    }
);
route.post('/createLeave',validate(LeavesSchema),
    async(req,res,next)=>{
        logger.info("Leaves router hit");
        errHandler(req,res,async()=>{
            const data = req.body;
            console.log(data);
            const result = await createLeave(data);
            console.log(result);
            logger.info("API's fetched successfully");
            return successResponse(result);
        })
    }
);


module.exports = route;
