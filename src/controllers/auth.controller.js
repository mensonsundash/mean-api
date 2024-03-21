import RoleModel from "../models/role.model.js";
import UserModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { CreateError, CreateSuccess } from "../utils/responseHandler.js";
import { signJwt, signJwtRefreshToken } from "../utils/jwt.utils.js";
import UserTokenModel from "../models/userToken.model.js";
// import nodemailer from 'nodemailer';
import globalUrl from "../config/global.config.js";
import mailSent from "../lib/email/send.js";


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
        
        const accessToken = signJwt({ id: user._id, isAdmin: user.isAdmin, roles: roles });
       
        const refreshToken = signJwtRefreshToken({ id: user._id, isAdmin: user.isAdmin, roles: roles });
        
        // return next(CreateSuccess(200, "Login successfully!"));
        res.cookie("accessToken", accessToken, {httpOnly: true})
        .status(200)
        .json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            status: 200,
            message: "Login successful",
            data: user
        })
    }catch(error){
        // return res.status(500).send("Internal Server Error!");
        return next(CreateError(500, "Internal Server Error!"));
    }
}




// export async function login(req, res, next) {
//     try{
//         const user = await UserModel.findOne({email: req.body.email})
//         .populate("roles", "role");

//         const { roles } = user;
//         if(!user){
//             return res.status(404).send("User not found!");
//         }

//         const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

//         if(!isPasswordCorrect){
//             return res.status(400).send("Password is incorrect!");
//         }
//         const token = jwt.sign(
//             {id: user._id, isAdmin: user.isAdmin, roles: roles},
//             process.env.ACCESS_TOKEN_SECRET,
//             {
//                 expiresIn: process.env.ACCESS_TOKEN_TTL
//             }
//         );
//         // return next(CreateSuccess(200, "Login successfully!"));
//         res.cookie("access_token", token, {httpOnly: true})
//         .status(200)
//         .json({
//             accessToken: token,
//             status: 200,
//             message: "Login successful",
//             data: user
//         })
//     }catch(error){
//         // return res.status(500).send("Internal Server Error!");
//         return next(CreateError(500, "Internal Server Error!"));
//     }
// }

export async function forgetPassword(req, res, next) {
    try{
        const email = req.body.email;
        const user = await UserModel.findOne({email: {$regex: '^'+email+'$', $options: 'i'} });

        if(!user){
            return next(CreateError(404, "User not found"));
        }
        
        const expiryMinutes = 5;
        const expiryHours = 0;
        const expiryTimeInMilliseconds = (expiryMinutes * 60 + expiryHours * 60 * 60) * 1000;

        const now = new Date();
        const expiryDate = new Date(now.getTime() + expiryTimeInMilliseconds);

        const token = signJwt({email: user.email}, expiryTimeInMilliseconds);
        
        const newToken = new UserTokenModel({
            userId: user.id,
            token: token
        });

        const web_url = globalUrl.web_url;
        const resetLink = web_url +`/auth/reset-password?token=${newToken.token}`;
        
        mailSent({
                to: user.email,
                subject: 'Reset your password',
                template: 'reset-password',
                templateVars: {
                    emailAddress: user.email,
                    resetLink,
                    resetTokenExpires: expiryDate,
                    firstName: user.firstName
                },
                newToken
            });
        

        return next(CreateSuccess(200, 'Mail sent', resetLink));
    
    }catch(error){
        return next(CreateError(500, "Internal Server Error!"));
    }
}