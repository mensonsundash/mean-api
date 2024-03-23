import RoleModel from "../models/role.model.js";
import UserModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { CreateError, CreateSuccess } from "../utils/responseHandler.js";
import { signJwt, signJwtRefreshToken, verifyJwt } from "../utils/jwt.utils.js";
import UserTokenModel from "../models/userToken.model.js";
// import nodemailer from 'nodemailer';
import globalUrl from "../config/global.config.js";
import mailSent from "../lib/email/send.js";


export async function register(req, res, next) {
    try{

        const user = await UserModel.findOne({email: req.body.email})
        .populate("roles", "role");

        if(user){
            const hasUserRole = user.roles.some(role => role.role === 'User');    
            if(hasUserRole){
                return next(CreateError(404, "User account already exist!"));
            }
            
        }
        
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
        return next(CreateSuccess(200, "User registered successfully!", newUser));
    }catch(error) {
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function registerAdmin(req, res, next) {
    try{

        const user = await UserModel.findOne({email: req.body.email})
        .populate("roles", "role");

        if(user){
            const hasAdminRole = user.roles.some(role => role.role === 'Admin');    
            if(hasAdminRole){
                return next(CreateError(404, "Admin account already exist!"));
            }
            
        }

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
        return next(CreateSuccess(200, "Admin registered successfully!"));
    }catch(error) {
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function login(req, res, next) {
    try{
        const user = await UserModel.findOne({email: req.body.email})
        .populate("roles", "role");

        if(!user){
            return next(CreateError(404, "User not found!"));
        }

        const { roles } = user;
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect){
            // return res.status(400).send({status:400, message: "Password is incorrect!"});
            return next(CreateError(400, "Password is incorrect!"));
        }
        
        const accessToken = signJwt({ id: user._id, isAdmin: user.isAdmin, roles: roles });
       
        const refreshToken = signJwtRefreshToken({ id: user._id, isAdmin: user.isAdmin, roles: roles });
        
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
        const user = await UserModel.findOne({email: {$regex: '^' + email + '$', $options: 'i'} });

        if(!user){
            return next(CreateError(404, "User not found"));
        }
        
        const expirySeconds = 0;//0 second
        const expiryMinutes = 15; //15 minutes
        const expiryHours = 0; //0 hrs
        const expiryTimeInMilliseconds = (expirySeconds + expiryMinutes * 60 + expiryHours * 60 * 60) * 1000;

        const now = new Date();
        const expiryDate = new Date(now.getTime() + expiryTimeInMilliseconds);

        const token = signJwt({email: user.email}, expiryTimeInMilliseconds);
        
        const newToken = new UserTokenModel({
            userId: user.id,
            token: token
        });

        const web_url = globalUrl.web_url;
        const resetLink = web_url +`/auth/reset-password/${newToken.token}`;
        
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
        

        return next(CreateSuccess(200, 'Email sent', resetLink));
    
    }catch(error){
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function resetPassword(req, res, next) {
    try{
        const token = req.body.token;
        const newPassword = req.body.password;

        const {decoded, valid, expired, error} = verifyJwt(token);

        if(error){
            return next(CreateError(500, "Reset Link is expired"));
        }

        if(decoded){
            const response = decoded;

            const user = await UserModel.findOne({ email: {$regex: '^' + response.email + '$', $options: 'i' } });

            const salt = await bcrypt.genSalt(10);
            const encryptPassword = await bcrypt.hash(newPassword, salt);

            var oldPassword = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if(oldPassword){
                return next(CreateError(404, "Password same as old password for: "+user.email));
            }else{
                user.password = encryptPassword;
                const updatedUser = await UserModel.findOneAndUpdate(
                    { _id: user._id },
                    { $set: user },
                    { new: true }
                );
                
                return next(CreateSuccess(200, "Password Reset Success!"));
            }
        }
    }catch(error){
        return next(CreateError(500, "Something went wrong while resetting password!"));
    }
}