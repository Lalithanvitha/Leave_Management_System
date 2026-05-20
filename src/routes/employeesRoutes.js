const express = require('express');
const route = express.Router();
const wrapRoutes = require('../utils/wrapRoutes');
const employeesServices = require('../services/employeesServices');
const { getEmployees, getEmployeeById, postEmployee, updateEmployee, deleteEmployee } = wrapRoutes(employeesServices);

route.get('/',getEmployees);
route.get('/:id',getEmployeeById);
route.post('/',postEmployee);
route.put('/:id',updateEmployee);
route.delete('/:id',deleteEmployee);

module.exports = route;


