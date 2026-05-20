const express = require('express');
const route = express.Router();
const wrapRoutes = require('../utils/wrapRoutes');
const leavesServices = require('../services/leavesServices');
const { getLeaveRequests, getLeaveRequestById, addLeaveRequests, updateLeaveRequest, deleteLeaveRequest,createLeave} = wrapRoutes(leavesServices);


route.get('/',getLeaveRequests);
route.get('/:id',getLeaveRequestById);
route.post('/',addLeaveRequests);
route.put('/:id',updateLeaveRequest);
route.delete('/:id',deleteLeaveRequest);
route.post('/createLeave',createLeave);


module.exports = route;
