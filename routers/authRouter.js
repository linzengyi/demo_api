import { Router } from "express";
import { login, logout } from '../controllers/authController.js';


const router = Router();


router.post('/auth/login', login);
router.get('/auth/logout',
/* 	
    #swagger.description = '帳號登出(方式1)' 
*/
logout);
router.delete('/auth/logout', 
/* 	
    #swagger.description = '帳號登出(方式2)' 
*/
logout);

export default router;