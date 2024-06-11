import { Router } from "express";

import { getUser, createUser, updateUser, checkAccount } from '../controllers/usersController.js';

const router = Router();


router.get('/user/profile', getUser);

router.post('/user/signup', createUser);

router.post('/user/signup/accountcheck', checkAccount);

router.put('/user/profile', updateUser);




export default router;