import Joi from "joi";

const listSchema = Joi.object({
    page: Joi.number(),
    limit: Joi.number(),
    query: Joi.string()
});
const createSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().valid(Joi.ref('password')),
    profileImage: Joi.string(),
    isAdmin: Joi.boolean(),
    roles: Joi.array().items(Joi.string()),
    state: Joi.number()
});
const updateSchema = Joi.object({
    id: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().valid(Joi.ref('password')),
    profileImage: Joi.string(),
    isAdmin: Joi.boolean(),
    roles: Joi.array().items(Joi.string()),
    state: Joi.number()
});
const loginCheckSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

const forgetCheckSchema = Joi.object({
    email: Joi.string().required()
});
const resetCheckSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
});
const findSchema = Joi.object({
    id: Joi.string().required()
});


export class UserValidator {
    constructor(type) {
        this.type = type;
    }

    validate(data) {
        let schema;

        switch(this.type){
            case "list":
                schema = listSchema;
                break;
            case "create":
                schema = createSchema;
                break;
            case "update":
                schema = updateSchema;
                break;
            case "loginCheck":
                schema = loginCheckSchema;
                break;
            case "forgetCheck":
                schema = forgetCheckSchema;
                break;
            case "resetCheck":
                schema = resetCheckSchema;
                break;
            case "delete":
                schema = findSchema;
                break;
            case "byId":
                schema = findSchema;
                break;
            default:
                break;
        }

    return schema.validate(data, { abortEarly: false });
    }
}