const express = require('express');
const route = express.Router();
const Emp = require('../models/employees');
const Leave = require('../models/leaves');
const Role = require('../models/roles');
const errHandler = require('../utils/errHandler');

//get roles
exports.getRoles = errHandler(async(req,res,next)=>{
    try{
        const result = await Role.query();
        if(!result){
            throw new Error("No roles found")
        }
        res.json({
            
            Roles:result
        })

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
            throw new Error(`No role found with the given id:${id}`)
        }
        res.json({
            message:`Role with id ${id}`,
            result
        });
    }catch(err){
        next(err);
    }
});
//post roles
exports.AddRole = errHandler(async(req,res,next)=>{
    try{
        const {name,emp_id} = req.body;
        if(!name || !emp_id){
            throw new Error("Both name and emp_id are required");
        }

        const result = await Role.query().insert({name,emp_id});
        res.json({
            Added_Role:result
        });
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
            throw new Error("name or emp_id atleast one field is required");
        }
        const existingRole = await Role.query().findById(id);
        if(!existingRole){
            throw new Error("Role is not found");
        }
        /*const duplicate = await Role.query()
                        .where({name:name,emp_id:emp_id})
                        .whereNot('id',id).first();
        if(duplicate.length>0){
            throw new Error("name and emp_id already exists")
        }*/
        const result = await Role.query().findById(id).patchAndFetchById(id,{name,emp_id});
        res.json({
            message:`Updated role with id: ${id}`,
            result
        })
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
            throw new Error("Role does not exist");
        }
        res.json({
            message:`Deleted role with id: ${id}`,
            deletedRole
        });

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
            throw new Error("Access denied");
        }


        const leaveRequest = await Leave.query().findById(idl);
        console.log(leaveRequest);
        console.log(leaveRequest.status);
        if(!leaveRequest){
            throw new Error("Leave request not found");
        }
        if(leaveRequest.status === "pending"){
            const result = await Leave.query()
                           .patchAndFetchById(idl,{status:status})
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