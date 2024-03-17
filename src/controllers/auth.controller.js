import RoleModel from "../models/role.model.js";
import UserModel from "../models/user.model.js";

export async function register(req, res, next) {
    try{
        const role = await RoleModel.find({role: "User"});
        const newUser = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            roles: role
        });
        await newUser.save();
        return res.status(200).send(newUser);
    }catch(error) {

    }
}