import mongoose, { Schema } from "mongoose";
import { getCollectionName } from '../utils/pluralize.js';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false,
        default: 'https://www.freepik.com/free-psd/3d-illustration-person-with-sunglasses_27470334.htm#query=user%20avatar&position=2&from_view=keyword&track=ais&uuid=1d814565-7775-4f9e-ab0c-c545025ac437'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    roles: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref:"Role"
    }
},{
    timestamps: true
});

//generate collection name with prefix and pluralization
UserSchema.set('collection', getCollectionName('user'));
// UserSchema.set('timestamps', {
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
// });
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;


// roles: {
//     //FOREIGN KEY
//     type: [Schema.Types.ObjectId],//Types: available in mongodb, and when primaryKey has been created then the type of primaryKey key is an ObjectId
//     required: true,
//     ref:"Role" //ref: from which table it is referring
// }