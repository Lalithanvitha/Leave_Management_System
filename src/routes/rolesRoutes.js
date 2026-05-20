const express = require('express');
const route = express.Router();
const wrapRoutes = require('../utils/wrapRoutes');
const roleServices = require('../services/roleServices');
const { getRoles, getRolesById, AddRole, UpdateRole, deleteRole, updateLeaveRequestByManager } = wrapRoutes(roleServices);
const validate = require('../validations/roleSchema');
const {createRolesSchema} = require( '../validations/roleSchema');
route.get('/',getRoles);
route.get('/:id',getRolesById);
route.post('/',AddRole);
route.put('/:id',UpdateRole);
route.delete('/:id',deleteRole);
route.patch('/:id',updateLeaveRequestByManager);


module.exports = route;