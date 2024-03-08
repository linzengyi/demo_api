import mongoose from 'npm:mongoose';
import mongoosePaginate from 'npm:mongoose-paginate-v2';

const accountsSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    incomeAndExpenditureDate: {
        type: Date,
        require: true
    },
    type: {
        type: Number,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    memo: {
        type: String,
        default: ''
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: true
});

accountsSchema.plugin(mongoosePaginate);

const accountsModel = mongoose.model('accounts', accountsSchema);

export default accountsModel;