import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    memo: {
        type: String,
        default: '',
        trim: true
    },
    done: {
        type: Boolean,
        default: false
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: true
});

todoSchema.plugin(mongoosePaginate);

const todoModel = mongoose.model('todos', todoSchema);

export default todoModel;