const Joi = require('joi');

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

module.exports = {
   createRolesSchema
};