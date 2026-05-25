const Ajv = require('ajv');
const EmployeesSchema = {
    type: "object",

    properties: {
        id: {
            type:"integer"
        },
        name: {
            type: "string"
        },
        email: {
            type: "string"
        },
        leave_balance: {
            type: "integer"
        }
        

    },

    required: ["name","email"]
};
module.exports = {EmployeesSchema};