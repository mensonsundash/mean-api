import mongoose, { Schema } from "mongoose";
import { getCollectionName } from "../utils/pluralize.js";

const UserTokenSchema = new mongoose.Schema({
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        token: {
            type: String,
            required: true
        },
        state:{
            type: Number,
            require: true,
            enum: [0, 1],
            default: 1,
            comment: '0 - INACTIVE, 1 - ACTIVE'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300
        }
    });

UserTokenSchema.set("collection", getCollectionName('user_token'));

const UserTokenModel = mongoose.model("user_token", UserTokenSchema);

export default UserTokenModel;