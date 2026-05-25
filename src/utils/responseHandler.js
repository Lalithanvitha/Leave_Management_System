const { DBError, DataError, ValidationError, NotFoundError } = require("objection");
const createError = require("http-errors");

const successResponse = (
  data = [],
  message = "Success",
  status = 200
) => {

  return {
    data:data,
    status:status,
    message:message,
    error:false
  }

};

const errorResponse = (
 err
) => {

  let status = 500;
  let message = 'Inernal Sever Error';

  if(err instanceof DBError) {
    status = 400;
    message = err?.message;
  }else if(err instanceof DataError){
    status = 406;
    message = err?.message;
  }else if(err instanceof ValidationError){
    status = 406;
    message = err?.message;
  }else if(err instanceof NotFoundError){
    status = 404;
    message = err?.message;
  }else if(err.status){
    status = err.status;
    message = err?.message;
  }
  return {
    data : {},
    message,
    status,
    error: true
  };
};

module.exports = {
  successResponse,
  errorResponse
};