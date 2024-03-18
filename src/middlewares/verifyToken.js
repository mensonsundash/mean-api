import jwt from 'jsonwebtoken';
import { CreateError } from '../utils/responseHandler.js';

export const verifyToken = (req, res, next) => {
    let token = req.cookies.access_token;

    if(!token){
        return next(CreateError(401, "You are not authenticated!"));
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return next(CreateError(403, "Token is not valid"));
        }
        req.user = decoded;
        next();
    })
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            return next(CreateError(403, "Your are not authorized User!"));
        }
        
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        }else{
            return next(CreateError(403, "Your are not authorized : Admin Role Required!"));
        }
        
    })
}