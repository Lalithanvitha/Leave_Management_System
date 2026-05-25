const express = require('express');
const route = express.Router();
//const wrapRoutes = require('../utils/wrapRoutes');
//const employeesServices = require('../services/employeesServices');
const { getEmployees, getEmployeeById, postEmployee, updateEmployee, deleteEmployee } = require('../services/employeesServices');
const errHandler = require('../utils/errHandler');
const { successResponse } = require('../utils/responseHandler');
const { errorResponse } = require('../utils/responseHandler');
const {pagination} = require('../helpers/paginationHelper');
const  logger  = require('../config/logger');
const {EmployeesSchema} = require('../validations/EmployeesSchema');
const validate = require( '../utils/validate');
route.get('/',
    async(req,res,next)=>{
        logger.info("Employees router hit");
        errHandler(req,res,async()=>{
            //console.log("route hit")
            const {role, page =1, limit=10} = req.query; 
            const result = await getEmployees(role,page,limit);
            logger.info("API's fetched successfully");
            return successResponse(result);
        })
    }
);
route.get('/:id',
    async(req,res,next)=>{
        logger.info("Employees router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            console.log(req.query);
            console.log(req.params);
            const result = await getEmployeeById(id);
            logger.info("API's fetched successfully");
            return successResponse(result);

        })
    }
);
 route.post('/',validate(EmployeesSchema),
    async(req,res,next)=>{
        logger.info("Employees router hit");
        errHandler(req,res,async()=>{
            const{name,email} = req.body; 
            const result = await postEmployee(name,email);
            const  logger  = require('../config/logger');
            return successResponse(result);
        })
    }
 );
route.put('/:id',
    async(req,res,next)=>{
        logger.info("Employees router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            const {name,email} = req.body;
            const result = await updateEmployee(id,name,email);
            const  logger  = require('../config/logger');
            return successResponse(result);
        })
    }

);
route.delete('/:id',
    async(req,res,next)=>{
        logger.info("Employees router hit");
        errHandler(req,res,async()=>{
            const {id} = req.params;
            const result = await deleteEmployee(id);
            const  logger  = require('../config/logger');
            return successResponse(result);

        })
    }
);

module.exports = route;


