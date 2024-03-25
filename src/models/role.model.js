import mongoose from "mongoose";
import { getCollectionName } from "../utils/pluralize.js";

const RoleSchema = new mongoose.Schema({
    role:{
        type: String,
        required: true,
        unique: true
    },
    state:{
        type: Number,
        require: true,
        enum: [0, 1],
        default: 1,
        comment: '0 - INACTIVE, 1 - ACTIVE'
    }
},{
    timestamps: true
});

//generate collection name with prefix and pluralization
RoleSchema.set('collection', getCollectionName('role'));

const RoleModel = mongoose.model('Role', RoleSchema);

export default RoleModel;