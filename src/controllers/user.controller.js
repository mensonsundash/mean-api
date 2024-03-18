import UserModel from "../models/user.model.js";
import { CreateError, CreateSuccess } from "../utils/responseHandler.js";

export async function getAllUsers(req, res, next) {
    try{
        const user = await UserModel.find();
        return next(CreateSuccess(200, "All users", user));
    }catch(error){
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function getById(req, res, next) {
    try{
        const user = await UserModel.findById(req.params.id);
        if(!user){
            return next(CreateError(404, "User not found!"));
        }
        return next(CreateSuccess(200, "Single user", user));
    }catch(error){
        return next(CreateError(500, "Internal Server Error!"));
    }
}