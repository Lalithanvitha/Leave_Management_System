require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("dev"));
require("./connection");
const empRoutes = require("./routes/employeesRoutes");
const leaveRoutes = require("./routes/leavesRoutes");
const roleRoutes = require("./routes/rolesRoutes");
const authRoutes = require("./routes/authenticationRoutes");
const monthRoutes = require("./routes/monthsRoutes");
const { bootstrap } = require("./connection");
app.use("/api/employees", empRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/month", monthRoutes);
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log("Server is running");
  bootstrap();
});
