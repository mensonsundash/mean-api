import mongoose from "mongoose";
import { getCollectionName } from "../utils/pluralize.js";

const RoleSchema = new mongoose.Schema({
    role:{
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps: true
});

//generate collection name with prefix and pluralization
RoleSchema.set('collection', getCollectionName('role'));

const RoleModel = mongoose.model('Role', RoleSchema);

export default RoleModel;