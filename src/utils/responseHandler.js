const successResponse = (
  res,
  data = [],
  message = "Success",
  status = 200
) => {

  return res.status(status).json({
    data,
    message,
    status,
    error: false
  });
};

const errorResponse = (
  res,
  message = "Something went wrong",
  status = 500,
  data = []
) => {

  return res.status(status).json({
    data,
    message,
    status,
    error: true
  });
};

module.exports = {
  successResponse,
  errorResponse
};