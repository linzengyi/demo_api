// import 'dotenv/config';
import * as db from './db.js';
import routers from './routers/routers.js';
import express from 'npm:express';
import cors from 'npm:cors';
import morgan from 'npm:morgan';

import { load } from "@std/dotenv";

const env = await load({ export: true });

const PORT = env.PORT; // Deno.env.get('PORT');

const con = await db.connect()
con.ready(() => {
    const app = express();

    app.use(cors());
    app.use(morgan(':method :url :status - :response-time ms'));
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api', routers);

    app.use((err, req, res, next) => {
        err.statusCode = err.statusCode || 500;
        err.message = err.message || 'Internal Server Error';
        console.error(`${req.method} ${req.url} 錯誤代碼: ${err.statusCode} - 錯誤訊息: ${err.message}`);
        res.status(200).json({ code: err.statusCode, message: err.message });
        // next('route');
    });

    app.use((req, res) => {
        console.log('is run final');
        res.status(404);
        res.send({ error: "Sorry, can't find that" });
    });

    app.listen(PORT, () => {
        console.log(`Server is run on port: ${PORT}`);
    });
});

