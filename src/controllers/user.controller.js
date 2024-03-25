import UserModel from "../models/user.model.js";
import { CreateError, CreateSuccess } from "../utils/responseHandler.js";
import { UserValidator } from "../validators/user.validator.js";

export async function getAllUsers(req, res, next) {
    try{
        const { query } = req;
        const validator = new UserValidator("list");

        const {error, value} = validator.validate(query)
        if(error){
            return next(CreateError(400, error.details));
        }
        const user = await UserModel.find();
        return next(CreateSuccess(200, "All users", user));
    }catch(error){
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function getById(req, res, next) {
    try{
        const { params } = req;
        const validator = new UserValidator("byId");
        const {error, value} = validator.validate({ ...params })
        if(error){
            return next(CreateError(400, error.details));
        }

        // const user = await UserModel.findById(req.params.id);
        const user = await UserModel.findById(value.id);
        if(!user){
            return next(CreateError(404, "User not found!"));
        }
        return next(CreateSuccess(200, "Single user", user));
    }catch(error){
        return next(CreateError(500, "Internal Server Error!"));
    }
}