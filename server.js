import express from 'express';
// import dotenv from 'dotenv';
import connect from './src/utils/connect.js'
import modelSchema from './src/models/index.js';
import routes from './src/routes/index.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import globalUrl from './src/config/global.config.js';

const app = express();
// dotenv.config();

const PORT = process.env.PORT || 8800;

//bodyparser setup allowing to req, res in json between db & server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cookie Parser
app.use(cookieParser());

//CORS Policy Middleware
app.use(cors({
    origin: globalUrl.web_url,
    credentials: true
}));
// app.options("*", cors());
// app.use(function(req,res,next){
//     //Enabling Cors
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Origin", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header(
//         "Access-Control-Allow-Origin", 
//         "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization, x-access-token"
//     );
//     next();
// });
// //routing endpoint express server
app.get('/', (req, res) => {
    return res.send(`Node & Express server is running on PORT :${PORT}`);
});

//DB Connection
connect();
//load model schema
modelSchema;

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
        data: obj.data,
        // stack: obj.stack
    })
});

//Creating server
app.listen(PORT, async()=>{
    
    console.log(`Server is running on socket: http://localhost:${PORT}`)
})