import RoleModel from "../models/role.model.js";
import { RoleValidation } from "../validators/role.validator.js";
import { CreateError, CreateSuccess } from "../utils/responseHandler.js";

// import Joi from "joi";

// const RoleSchema = Joi.object({
//     role: Joi.string().required()
// });

export async function createRole(req, res, next) {
    try{
        const validator = new RoleValidation("create");
        const {error, value} = validator.validate(req.body);
        
        if(error){
            console.log(error);
            // return res.status(400).send(error.details);
            return next(CreateError(400, error.details));
        }


        // if(validator.validate(req.body)){
            // const value = validator.value;
            
            if(value.role && value.role !== '') {
                const newRole = new RoleModel(value);//value returned by validator after validation
                await newRole.save();
                // return res.send(newRole);
                return next(CreateSuccess(200, "Role created successfully!", newRole));
            }else{
                // return res.status(400).send("Bad Request");
                return next(CreateError(400, "Bad Request!"));
            }
        // }else{
        //     const errors = validator.errors;
        //     console.log(errors);
        //     return res.status(400).send(errors);
        // }
            
    } catch(error) {
        // return res.status(500).send("Internal Server Error!");
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function updateRole(req, res, next) {
    try{    
        const {params, body} = req;
        const validator = new RoleValidation("update");
        const {error, value} = validator.validate({...params, ...body});
        
        if(error){
            console.log(error);
            // return res.status(400).send(error.details);
            return next(CreateError(400, error.details));
        }

        const role = await RoleModel.findById({_id: value.id}); //value returned by validator after validation
        if(role){
            const newData = await RoleModel.findByIdAndUpdate(
                value.id,
                {$set: value},
                {new: true}
            );
            // return res.status(200).send(newData);
            return next(CreateSuccess(200, "Update Successful!", newData));
        }else{
            // return  res.status(404).send("Role not found");
            return next(CreateError(404, "Role not found!"));
        }
    }catch(error){
        // return  res.status(500).send("Internal Server Error!");
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function getAllRoles(req, res, next) {
    try{
        const {query} = req;
        const validator = new RoleValidation("list");
        const {error, value} = validator.validate(query);
        
        if(error){
            console.log(error);
            // return res.status(400).send(error.details);
            return next(CreateError(400, error.details));
        }

        const roles = await RoleModel.find().sort({ updatedAt: -1 });
        // res.json(roles);
        // return res.status(200).send(roles);
        return next(CreateSuccess(200, "Roles Sucessfully listed!", roles));
    }catch(error){
        // return res.status(500).send("Internal Server Error!");
        return next(CreateError(500, "Internal Server Error!"));
    }
}

export async function deleteRole(req, res, next) {
    try{
        const {params} = req;
        const validator = new RoleValidation("delete");
        const {error, value} = validator.validate({...params});
        
        if(error){
            console.log(error);
            // return res.status(400).send(error.details);
            return next(CreateError(400, error.details));
        }

        const roleId = value.id; //value returned by validator after validation
        
        const role = await RoleModel.findById({_id: roleId});
        
        if(role){
            await RoleModel.findByIdAndDelete(roleId);
            // return res.status(200).send("Role Deleted!")
            return next(CreateSuccess(200, "Role Deleted!"));
        }
        next();
    }catch(error){
        return next(CreateError(500, "Internal Server Error!"));
    }
}