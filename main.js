import 'dotenv/config';
import * as db from './db.js';
import routers from './routers/routers.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { loadJsonFileSync } from 'load-json-file';
import swaggerUi from 'swagger-ui-express';

(async () => {
    const PORT = process.env.PORT || 3000;
 
    const con = await db.connect();
    
    con.ready(() => {       
        const app = express();

        app.use(cors());
        app.use(morgan(':method :url :status - :response-time ms'));
        app.use(express.static('public'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        app.use('/api', routers);

        if (process.env.MODE && process.env.MODE === 'devloper') {
            const swaggerDocument = loadJsonFileSync('swagger-output.json');
            app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        }
        
        app.use((err, req, res, next) => {
            err.statusCode = err.statusCode || 500;
            err.message = err.message || 'Internal Server Error';
            console.error(`${req.method} ${req.url} 錯誤代碼: ${err.statusCode} - 錯誤訊息: ${err.message}`);
            res.status(200).json({ code: err.statusCode, message: err.message });
            // next('route');
        });

        app.use((req, res) => {
            res.status(404);
            res.send({ error: "Sorry, can't find that" });
        });

        app.listen(PORT, () => {
            console.log(`Server is run on port: ${PORT}`);
        });
    });
}) ();
