import RoleModel from "../models/role.model.js";
import UserModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

export async function registerAdmin(req, res, next) {
    try{
        const role = await RoleModel.find({});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hashSync(req.body.password, salt);
        
        const newUser = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            isAdmin: true,
            roles: role
        });
        await newUser.save();
        // return res.status(200).send(newUser);
        return next(CreateSuccess(200, "Admin registered successfully!"));
    }catch(error) {
        // return res.status(500).send("Internal Server Error!");
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function login(req, res, next) {
    try{
        const user = await UserModel.findOne({email: req.body.email})
        .populate("roles", "role");

        const { roles } = user;
        if(!user){
            return res.status(404).send("User not found!");
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).send("Password is incorrect!");
        }
        const token = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin, roles: roles},
            process.env.JWT_SECRET
        );
        // return next(CreateSuccess(200, "Login successfully!"));
        res.cookie("access_token", token, {httpOnly: true})
        .status(200)
        .json({
            status: 200,
            message: "Login successful",
            data: user
        })
    }catch(error){
        // return res.status(500).send("Internal Server Error!");
        return next(CreateError(500, "Internal Server Error!"));
    }
}