const express = require('express');
const { getRoles, getRolesById, AddRole, UpdateRole, deleteRole, updateLeaveRequestByManager } = require('../services/roleServices');
const route = express.Router();

route.get('/',getRoles);
route.get('/:id',getRolesById);
route.post('/',AddRole);
route.put('/:id',UpdateRole);
route.delete('/:id',deleteRole);
route.patch('/:id',updateLeaveRequestByManager);


module.exports = route;