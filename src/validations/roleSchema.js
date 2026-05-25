/*const Joi = require('joi');

const createRolesSchema =
Joi.object({

   name:
   Joi.string()
       .required(),

   emp_id:
   Joi.number()
       .integer()
       .required()

});

module.exports = {createRolesSchema};*/
const Ajv = require('ajv');
const roleSchema = {
    type: "object",

    properties: {
        id: {
            type:"integer"
        },
        name: {
            type: "string"
        },
        emp_id: {
            type: "integer"
        }
        

    },

    required: ["name","emp_id"]
};
module.exports = {roleSchema};