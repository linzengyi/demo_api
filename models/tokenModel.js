import mongoose from 'mongoose';


const tokenSchema = mongoose.Schema({
    state: {            // 狀態: ''(有效)、E(無效)
        type: String,
        default: ''
    },
    loginUserId: mongoose.Types.ObjectId,
    token: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});


const tokenModel = mongoose.model('tokens', tokenSchema);

export default tokenModel;