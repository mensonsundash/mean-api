import Joi from "joi";

const listSchema = Joi.object({
    page: Joi.number(),
    limit: Joi.number(),
    query: Joi.string()
});

const createSchema = Joi.object({
    role: Joi.string().required()
});

const updateSchema = Joi.object({
    id: Joi.string().required(),
    role: Joi.string().required()
});

const findSchema = Joi.object({
    id: Joi.string().required(),
});


export class RoleValidation {

    constructor(type){
        this.type = type
    }

    validate(data){
        let schema;

        switch(this.type){
            case "list":
                schema= listSchema;
                break;
            case "create":
                schema= createSchema;
                break;
            case "update":
                schema= updateSchema;
                break;
            case "delete":
                schema= findSchema;
                break;
            case "byId":
                schema= findSchema;
                break;
            default:
                break;
        }

        // const { error, value } = schema.validate(data, { abortEarly: false });

        // if(error){
        //     this.value = {};
        //     this.errors = error;
        //     return false;
        // }
        // this.value = value;
        // this.errors = [];
        // return true;

        return schema.validate(data, { abortEarly: false });
    }
}