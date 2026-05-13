const express = require('express');
const route = express.Router();
const Emp = require('../models/employees');
const Leave = require('../models/leaves');
const Role = require('../models/roles');
const errHandler = require('../utils/errHandler');
//Middleware
exports.middleware = (req,res,next)=>{
    console.log("Request received");
    next();
};
//Add employee
exports.postEmployee = errHandler(async(req,res,next)=>{
    try{
        
        const{name,email} = req.body;
        if(!name||!email){
            throw new Error("name,email fields are required");
        }

        const result = await Emp.query().insert({name,email});
        const employees  = await Emp.query();
        res.json({
            message:"Added an employee",
            result,
            employees
    });  
    }catch(err){
        next(err);
    }

});
//get employees
exports.getEmployees = errHandler(async(req,res,next)=>{
    try{
        const result = await Emp.query();
        if(!result){
            throw new Error("No employees found");
        }
        res.json({
            message:"Employees",
            result
        });
    }catch(err){
        next(err);
    }

});
//get employee by id
exports.getEmployeeById = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const result = await Emp.query().findById(id);
        //SELECT * FROM employees WHERE id = 1
        if(!result){
            throw new Error("Employee not found");
        }
        res.json({
            message:"Employees",
            result
        });
    }catch(err){
        next(err);
    }

});
//update employee
exports.updateEmployee = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const {name,email} = req.body;
        if(!name&&!email){
            throw new Error("name,email any one field is required")
        }
        const existingUser = await Emp.query().findById(id);
        if(!existingUser){
            throw new Error("User not found");
        }
        const duplicate = await Emp.query()
                          .where(builder=>{
                          if (name) {
                            builder.where('name', name);
                          }

                          if (email) {
                            builder.orWhere('email', email);
                          }
                          })
                          .whereNot('id',id);
        if(duplicate.length>0){
            throw new Error("name,email already exists")
        }
        const result = await Emp.query().patchAndFetchById(id,{name,email});
        const employees  = await Emp.query();
        res.json({
            message:`Updated employee with id: ${id}`,
            result,
            employees
    }); 
    }catch(err){
        next(err);
    }

});

exports.deleteEmployee = errHandler(async(req,res,next)=>{
    try{
        const id = req.params.id;
        const result = await Emp.query().deleteById(id).returning('*');
        if(!result){
            throw new Error(`Employee with given id ${id} not found`);
        }
        const remEmployees = await Emp.query();
        res.json({
            message:`Deleted employee with id: ${id}`,
            result,
            remEmployees
        });
    }catch(err){
       next(err);
    }

});





/*route.put('/apply/:id',async(req,res)=>{
    try{
        const {leave} = req.body;
        const id = req.params.id;
        if(!leave){
            return res.status(404).json({message:"Reason for leave should mention"});
        }
        const existingUser = await Emp.query().findById(id);
        if(!existingUser){
            return res.status(404).json({message:"User not found"});
        }
        const result = await Emp.query().patchAndFetchById(id,{leave});
        res.json({
            message:"Leave",
            ReasonForLeave:result
        })
    }catch(err){
        res.send(err);
    }



})*/


//module.exports = route;