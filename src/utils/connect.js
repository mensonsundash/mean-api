import mongoose from "mongoose";
import dotenv from 'dotenv';
// import db_config from "../config/db.config";
dotenv.config();

async function connect() {
    try{
        // mongoose.Promise = global.Promise;
        // await mongoose.connect(`mongodb://${db_config.HOST}:${db_config.PORT}/${db_config.DB}`, {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database');
    }catch(error){
        console.log('Could not connect to db.')
        process.exit(1);
    }
}

export default connect;