import RoleModel from "../models/role.model.js";
import UserModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { CreateError, CreateSuccess } from "../utils/responseHandler.js";

export async function register(req, res, next) {
    try{
        const role = await RoleModel.find({role: "User"});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hashSync(req.body.password, salt);
        
        const newUser = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            roles: role
        });
        await newUser.save();
        // return res.status(200).send(newUser);
        return next(CreateSuccess(200, "User registered successfully!"));
    }catch(error) {
        // return res.status(500).send("Internal Server Error!");
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function login(req, res, next) {
    try{
        const user = await UserModel.findOne({email: req.body.email});

        if(!user){
            return res.status(404).send("User not found!");
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).send("Password is incorrect!");
        }
        // return res.status(200).send("Login success!");
        return next(CreateSuccess(200, "Login successfully!"));
    }catch(error){
        // return res.status(500).send("Internal Server Error!");
        return next(CreateError(500, "Internal Server Error!"));
    }
}