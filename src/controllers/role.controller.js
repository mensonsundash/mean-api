import RoleModel from "../models/role.model.js";

export async function createRole(req, res, next) {
    try{
        if(req.body.role && req.body.role !== '') {
            const newRole = new RoleModel(req.body);
            await newRole.save();
            return res.send("Role Created");
        }else{
            return res.status(400).send("Bad Request");
        }
    } catch(error) {
        return res.status(500).send("Internal Server Error!");
    }
}

export async function updateRole(req, res, next) {
    try{
        const role = await RoleModel.findById({_id: req.params.id});
        if(role){
            const newData = await RoleModel.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                {new: true}
            );
            return res.status(200).send("Role updated!");
        }else{
            return  res.status(404).send("Role not found");
        }
    }catch(error){
        return  res.status(500).send("Internal Server Error!");
    }
}

export async function getAllRoles(req, res, next) {
    try{
        const roles = await RoleModel.find();
        // res.json(roles);
        return res.status(200).send(roles);
    }catch(error){
        return res.status(500).send("Internal Server Error!");
    }
}

export async function deleteRole(req, res, next) {
    try{
        const roleId = req.params.id;
        const role = await  RoleModel.findById({_id: roleId});
        if(role){
            await RoleModel.findByIdAndDelete(roleId);
            return res.status(200).send("Role Deleted!")
        }
    }catch(error){

    }
}