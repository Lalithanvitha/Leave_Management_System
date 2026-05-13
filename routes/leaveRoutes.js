const express = require('express');
const { getLeaveRequests, getLeaveRequestById, addLeaveRequests, updateLeaveRequest, deleteLeaveRequest, updateLeaveRequestByManager } = require('../services/leavesServices');
const route = express.Router();

route.get('/',getLeaveRequests);
route.get('/:id',getLeaveRequestById);
route.post('/',addLeaveRequests);
route.put('/:id',updateLeaveRequest);
route.delete('/:id',deleteLeaveRequest);
//route.patch('/:idr',updateLeaveRequestByManager);

module.exports = route;
