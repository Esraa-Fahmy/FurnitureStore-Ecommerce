      const express = require('express');
      const dotenv = require('dotenv');
      const morgan = require('morgan');
      const databaseConnect = require('./config/database');
      dotenv.config({ path: '.env' });
      const globalError = require('./important/globalError');
      const allError = require('./middleware/error.middleware');
      const categoryRoute = require('./routes/category.route');
      const productRoute = require('./routes/product.route');
      const userRoute = require('./routes/user.route');
      const authRoute = require('./routes/auth.route');
     
     
      databaseConnect();
      const app = express();


      app.use(express.json());


      if (process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
        console.log(`mode: ${process.env.NODE_ENV}`);
      }


      app.use('/api/v1/categories', categoryRoute);
      app.use('/api/v1/products', productRoute);
      app.use('/api/v1/users', userRoute);
      app.use('/api/v1/auth', authRoute);


      app.all('*', (req, res, next) => {
      next(new globalError(`Can't find this route: ${req.originalUrl}`, 400));
      });

     

//Global err
      app.use(allError);



        const PORT = process.env.PORT || 8000;
        const server = app.listen(PORT, () => {
          console.log(`App running running on port ${PORT}`);
        });
        
        process.on('unhandledRejection', (err) => {
        console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
        server.close(() => {
       console.error(`Shutting down..`);
        process.exit(1);
        });
      });


      


    
    
