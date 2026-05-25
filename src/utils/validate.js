/*const validate =(schema) => {
    return (req, res, next) => {
        const { error } =schema.validate(req.body);
        if(error){
            return res.status(400).json({
                      success: false,
                      message:error.details[0].message
                   });
        }
        next();
   };
};

module.exports = validate;*/

const Ajv = require('ajv');
const addFormats = require("ajv-formats");

const ajv = new Ajv({
    allErrors: true
});
addFormats(ajv);
const validate = (
    schema,
    property = 'body'
) => {

    const validator =
        ajv.compile(schema);

    return (req, res, next) => {

        const data =
            req[property];

        const valid =
            validator(data);

        if (!valid) {

            return res.status(400).json({
                success: false,
                errors: validator.errors
            });
        }

        next();
    };
};

module.exports = validate;