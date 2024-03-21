import jwt from 'jsonwebtoken';
import { CreateError } from './responseHandler.js';

export function signJwt(user, expiryTime = null){

    if(!expiryTime){
        var expiryTime = process.env.ACCESS_TOKEN_TTL
    }

    if(!process.env.ACCESS_TOKEN_SECRET){
        return next(CreateError(401, "Missing jwt token!"));
    }else{
        const token = jwt.sign(
            user,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: expiryTime
            }
        );
    
        return token;
    }
}

export function signJwtRefreshToken(user, expiryTime = null){

    if(!expiryTime){
        var expiryTime = process.env.REFRESH_TOKEN_TTL
    }

    if(!process.env.REFRESH_TOKEN_SECRET){
        return next(CreateError(401, "Missing jwt token!"));
    }else{
        const token = jwt.sign(
            user,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: expiryTime
            },
            
        );

        return token;
    }
}

//verify with a public key
export function verifyJwt(token){
    try{
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("Missing JWT secret key");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        return {
            decoded, 
            expired: false,
            error: null,
            valid: true,
        };
    }catch(e) {
        
        return {
            decoded: null,
            expired: e instanceof jwt.TokenExpiredError,
            error: e.message,
            valid: false
        }
    }
}



// export function verifyToken(token) {
//     if(!token){
//         return next(CreateError(401, "Missing jwt token!"));
//     }else{
//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         //     if(err){
//         //         return next(CreateError(403, "Token is not valid"));
//         //     }
//         //     req.user = decoded;
//         //     next();
//         // })
//     }
// }
