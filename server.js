import express from 'express';
import dotenv from 'dotenv';
import connect from './src/utils/connect.js'
import modelSchema from './src/models/index.js';

const app = express();
dotenv.config();

const PORT = 8800;

//routing endpoint express server
app.use('/', (req, res) => {
    return res.send(`Node & Express server is running on socket http://localhost:${PORT}`);
});
//Creating server
app.listen(PORT, ()=>{
    //DB Connection
    connect();
    //load model schema
    modelSchema;
    console.log(`Server is running on socket: http://localhost:${PORT}`)
})