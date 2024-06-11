import { Router } from 'express';
import * as todo from '../controllers/todoController.js'
const router = Router();



// 新增待辦事項
router.post('/todos', todo.create);

// 取得待辦清單
router.get('/todos', todo.getList);

// 修改待辦事項
router.put('/todos/:id', todo.update);

// 刪除待辦事項
router.delete('/todos/:id', todo.remove);

// 待辦狀態更新
router.put('/todos/:id/state', todo.updateState);

export default router;