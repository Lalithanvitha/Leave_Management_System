const nodemailer = require("nodemailer");
const { Liquid } = require("liquidjs");
const path = require("path");
const engine = new Liquid({
  root: path.join(__dirname, "../temps"), // root for layouts/includes lookup
  extname: ".liquid", // used for layouts/includes, defaults ""
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLeaveStatusMail = async (
  employeeEmail,
  employeeName,
  from_date,
  to_date,
  managerName,
  status,
) => {
  const subject =
    status === "APPROVED" ? "Leave is approved" : "Leave is rejected";
  const template = status === "APPROVED" ? "approve.liquid" : "reject.liquid";
  const html = await engine.renderFile(template, {
    employeeEmail,
    employeeName,
    from_date,
    to_date,
    managerName,
    status,
  });
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: employeeEmail,
    subject,
    html,
  });
  return info;
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("Sending mail to:", employeeEmail);
  console.log(info);
};
module.exports = { sendLeaveStatusMail };
