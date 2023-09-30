const allError = require('../important/globalError');


    const sendErrorForDev = (err, res) => {
        return res.status(err.statusCode).json({
          status: err.status,
          error: err,
          message: err.message,
          stack: err.stack,
        });
    };
    const sendErrorForProd = (err, res) => {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
          
        });
    };

  module.exports = allError;
  
