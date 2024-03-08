import { Router } from 'npm:express';
import todoRouter from './todoRouter.js';
import accountsRouter from './accountsRouter.js';
import authRouter from './authRouter.js';


const rootRouter = Router();

rootRouter
    .use('/version', (req, res) => {
        res.status(200).json({
            version: '0.2.0'
        });
    })
    .use(authRouter)
    .use(todoRouter)
    .use(
        // #swagger.deprecated = true
        accountsRouter);

export default rootRouter;