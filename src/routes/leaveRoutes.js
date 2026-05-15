const express = require('express');
const { getLeaveRequests, getLeaveRequestById, addLeaveRequests, updateLeaveRequest, deleteLeaveRequest } = require('../services/leavesServices');
const route = express.Router();

route.get('/',getLeaveRequests);
route.get('/:id',getLeaveRequestById);
route.post('/',addLeaveRequests);
route.put('/:id',updateLeaveRequest);
route.delete('/:id',deleteLeaveRequest);


module.exports = route;
