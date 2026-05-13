const express = require('express');
const app = express();
app.use(express.json());
require('./connection');
const empRoutes = require('./routes/empRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const roleRoutes = require('./routes/roleRoutes');
app.use("/api/employees",empRoutes);
app.use("/api/leaves",leaveRoutes);
app.use("/api/roles",roleRoutes);
app.use((err,req,res,next)=>{
    console.error(err.message);
    res.status(500).json({error:err.message});
    
});
app.listen(3000,()=>console.log('Server is running'));