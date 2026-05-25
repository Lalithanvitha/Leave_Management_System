const express = require('express');
const route = express.Router();
//const wrapRoutes = require('../utils/wrapRoutes');
//const roleServices = require('../services/roleServices');
const { getRoles, getRolesById, AddRole, UpdateRole, deleteRole, updateLeaveRequestByManager } = require('../services/roleServices');
const {roleSchema} = require('../validations/roleSchema');
const validate = require( '../utils/validate');
const errHandler = require('../utils/errHandler');
const { successResponse } = require('../utils/responseHandler');
const { errorResponse } = require('../utils/responseHandler');
const {pagination} = require('../helpers/paginationHelper');
const  logger  = require('../config/logger');
route.get('/',
    async(req,res,next)=>{
        logger.info("Roles router hit");
         errHandler(req,res,async()=>{
            //console.log("roles errHandler")
            const {emp_id, page = 1, limit = 10} = req.query;
            //console.log(emp_id,page,limit);
            const result = await getRoles(emp_id,page,limit);
            logger.info("API's fetched successfully");
            return successResponse(result);
         });
    }
);
route.get('/:id',
    async(req,res,next)=>{
        logger.info("Roles router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            const result = await getRolesById(id);
            logger.info("API's fetched successfully");
            return successResponse(result);

        });
    }

);
route.post('/',validate(roleSchema),
    async(req,res,next)=>{
        logger.info("Roles router hit");
        errHandler(req,res,async()=>{
            const {name,emp_id} = req.body;
            const result = await AddRole(name,emp_id);
            logger.info("API's fetched successfully");
            return successResponse(result);
        });
    }
);
route.put('/:id',
    async(req,res,next)=>{
        logger.info("Roles router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            const {name,emp_id} = req.body;
            const result = await UpdateRole(id,name,emp_id);
            logger.info("API's fetched successfully");
            return successResponse(result);
        });
    }
);
route.delete('/:id',
    async(req,res,next)=>{
        logger.info("Roles router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            const result = await deleteRole(id);
            logger.info("API's fetched successfully");
            return successResponse(result);
        });
    }
);
route.patch('/:id',
    async(req,res,next)=>{
        logger.info("Roles router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            const {idl,status} = req.body;
            const result = await updateLeaveRequestByManager(id,idl,status);
            logger.info("API's fetched successfully");
            return successResponse(result);
        });
    }
);


module.exports = route;