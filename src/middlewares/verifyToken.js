// import jwt from 'jsonwebtoken';
import { CreateError } from '../utils/responseHandler.js';
import { verifyJwt } from '../utils/jwt.utils.js';

// export const verifyToken = (req, res, next) => {
//     let token = req.cookies.accessToken;

//     if(!token){
//         return next(CreateError(401, "You are not authenticated!"));
//     }
    
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if(err){
//             return next(CreateError(403, "Token is not valid"));
//         }
//         req.user = decoded;
//         next();
//     })
// }

export function verifyToken (req, res, next) {
    // let accessToken = req.cookies.accessToken;
    const authHeader = req.headers['authorization'];
    
    const accessToken = authHeader && authHeader.split(' ')[1];
    
    let refreshToken = req.headers['x-refresh']; //get(req, "headers.x-refresh", ""); 
    
    
    if(!accessToken){
        return next(CreateError(401, "You are not authenticated!"));
    }
    
    const {decoded, valid, expired, error} = verifyJwt(accessToken);

    if(error){
        return next(CreateError(403, "Token is not valid"));
    }

    if(expired && refreshToken){
        if(expired){
            return next(CreateError(403, "Token has expired"));
            
        } 
        //creating a refresh token on expiry and reIssueAccessToken from that refresh token with contained data payload
        // if(refreshToken){
        //     const newAccessToken = 
        // } 
    }

    if(decoded){
        req.user = decoded;
        next();
    }

 
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log("REQ DTA: ", req);
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