// import 'dotenv/config';
import mongoose from 'npm:mongoose';

import { load } from "@std/dotenv";

const env = await load({ export: true });
console.log(env.MONGODB_URI);
// const uri = Deno.env.get("MONGODB_URI") || 'mongodb://127.0.0.1:27017/demo';
const uri = env.MONGODB_URI || 'mongodb://127.0.0.1:27017/demo';

const Connect = {
    ready(handler) {
        handler();
    }
};

async function connect() {
    try {
        await mongoose.connect(uri);
        // .catch((err) => {
        //     console.log('錯誤訊息:', err.message);
        //     process.exit(0);
        // });

        return Promise.resolve(Connect);
    } catch(err) {
        console.log('錯誤訊息:', err.message);
        process.exit(0);
    };
}

export {
    connect
}
