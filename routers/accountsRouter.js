import { Router } from "npm:express";
import * as accounts from '../controllers/accountsController.js';


const router = Router();

// 取得記帳清單
router.get('/accounts', accounts.getList);
// 新增記帳項目
router.post('/accounts', accounts.create);
// 修改記帳內容
router.put('/accounts/:id', accounts.update);
// 刪除記帳內容
router.delete('/accounts/:id', accounts.remove);

export default router;