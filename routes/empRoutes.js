const express = require('express');
const { getEmployees, getEmployeeById, postEmployee, updateEmployee, deleteEmployee } = require('../services/empServices');
const route = express.Router();

route.get('/',getEmployees);
route.get('/:id',getEmployeeById);
route.post('/',postEmployee);
route.put('/:id',updateEmployee);
route.delete('/:id',deleteEmployee);

module.exports = route;


