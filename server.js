import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
const PORT = 8800;

//DB Connection

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database');
    }catch(error){
        throw(error);
    }
}
//routing endpoint
app.use('/', (req, res) => {
    return res.send(`Node & Express server is running on socket http://localhost:${PORT}`);
});
//Creating server
app.listen(PORT, ()=>{
    connectMongoDB();
    console.log(`Server is running on socket: http://localhost:${PORT}`)
})