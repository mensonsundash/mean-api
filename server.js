import express from 'express';
import dotenv from 'dotenv';
import connect from './src/utils/connect.js'
import modelSchema from './src/models/index.js';
import routes from './src/routes/index.js';
import bodyParser from 'body-parser';

const app = express();
dotenv.config();

const PORT = 8800;

//bodyparser setup allowing to req, res in json between db & server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// //routing endpoint express server
// app.use('/', (req, res) => {
//     return res.send(`Node & Express server is running on socket http://localhost:${PORT}`);
// });

//routes api gateway
app.use('/api', routes);

//Response Handler Middleware
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const errorMessage = obj.message || "Internal Server Error!";
    return res.status(statusCode).json({
        success: [200,201,204].some( a => a === obj.status) ? true: false,
        status: statusCode,
        message: errorMessage,
        data: obj.data
        // stack: err.stack
    })
});

//Creating server
app.listen(PORT, ()=>{
    //DB Connection
    connect();
    //load model schema
    modelSchema;
    
    console.log(`Server is running on socket: http://localhost:${PORT}`)
})