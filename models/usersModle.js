import mongoose from 'mongoose';


const UserSchema = mongoose.Schema({
    account: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: ''
    }
}, 
{
    timestamps: true
});


const usersModel = mongoose.model('users', UserSchema);

export default usersModel;