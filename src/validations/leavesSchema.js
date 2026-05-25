const Ajv = require('ajv');
const addFormats = require("ajv-formats");
const LeavesSchema = {
    type: "object",

    properties: {
        id: {
            type:"integer"
        },
        emp_id: {
            type: "integer"
        },
        leavereason: {
            type: "string"
        },
        status: {
            type: "string"
        },
        from_date: {
            type: "string",
            format: "date"
        },
        to_date: {
            type: "string",
            format: "date"
        },
        days:{
            type:"integer"
        }
        
        

    },

    required: ["emp_id","leavereason","from_date","to_date","days"]
};
module.exports = {LeavesSchema};