import 'dotenv/config';
import mongoose from 'mongoose';


const Connect = {
    ready(handler) {
        handler();
    }
};

async function connect() {
    try {
        const uri = process.env.MONGODB_URI ||  'mongodb://127.0.0.1:27017/demo';

        await mongoose.connect(uri);
        
        if (mongoose.connection.readyState === 1) {
            console.log('is connect.');
        }

        return Connect;//Promise.resolve(Connect);
    } catch(err) {
        console.log('錯誤訊息:', err.message);
        process.exit(0);
    };
}

export {
    connect
}
