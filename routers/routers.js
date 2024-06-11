import { Router } from 'express';
import todoRouter from './todoRouter.js';
import accountsRouter from './accountsRouter.js';
import authRouter from './authRouter.js';
import userRouter from './usersRouter.js';


const rootRouter = Router();

rootRouter
    .use('/version', (req, res) => {
        res.status(200).json({
            version: '0.2.2'
        });
    })
    .use(userRouter)
    .use(authRouter)
    .use(todoRouter)
    .use(accountsRouter);

export default rootRouter;