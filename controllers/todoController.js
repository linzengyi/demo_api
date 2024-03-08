import todoModel from '../models/todoModel.js'

// 新增待辦事項
export async function create(req, res) {
    /* 	
        #swagger.tags = ['Todo-待辦事項']
        #swagger.description = '新增待辦事項' 
    */
    try {
        /*
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Todo新增資料.',
                required: true,
                schema: { $ref: "#/definitions/todoCreateData" }
            }
        */
        const { title, memo } = req.body;

        const newData = {
            title,
            memo
        };

        const data = await todoModel.create(newData);

        /* 
            #swagger.responses[200] = {
                description: '成功',
                schema: {
                    success: true,
                    data: {
                      $ref: '#/definitions/todoData'
                    }
                }
            }
        */
        res.json({
            success: true,
            data
        });
    } catch(error) {
        /* 
            #swagger.responses[400] = {
                description: '錯誤',
                schema: {
                    success: false,
                    message: '錯誤內容'
                }
            }
        */
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}

// 取得待辦清單
export async function getList(req, res) {
    /* 
        #swagger.tags = ['Todo-待辦事項']
        #swagger.description = '取得待辦事項清單' 
    */
    try {
        /* 
            #swagger.parameters['done'] = {
                in: 'query',
                type: 'number',
                description: '取得完成狀態紀錄，值: 0未完成 1已完成',
                
            }
            #swagger.parameters['page'] = {
                in: 'query',
                type: 'number',
                description: '指定第x頁'
                
            }
            #swagger.parameters['limit'] = {
                in: 'query',
                type: 'number',
                description: '指定每頁顯示筆數'
            }
        */
        const { done, page, limit } = req.query;
        
        const query = { isDelete: false };
        
        // 查詢參數done，值: 0未完成 1已完成 紀錄
        if (done !== undefined) {
            query['done'] = done !== '0' ? true : false;
        }

        const dataList = await todoModel
            .paginate(query, 
                {
                    page: page || 1,
                    limit: limit || 10,
                    sort: { createdAt: -1 }
                });

        /* #swagger.responses[200] = {
            description: '成功',
            schema: {
                success: true,
                docs: [{
                    "_id": "65c5e78e1773050c199ac11c",
                    "title": "待辦事項內容",
                    "memo": "待辦事項備註",
                    "done": false,
                    "isDelete": false,
                    "createdAt": "2024-02-09T08:51:26.444Z",
                    "updatedAt": "2024-02-27T11:25:14.797Z"
                }],
                totalDocs: 4,
                limit: 6,
                totalPages: 1,
                page: 1,
                pagingCounter: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null
            }
        }  */ 
        res.status(200).json({
            success: true,
            ...dataList
        });
    } catch(error) {
        /* #swagger.responses[400]= {
            description: '錯誤',
            schema: {
                success: false,
                message: '錯誤內容'
            }
        } */ 
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}

// 修改待辦事項
export async function update(req, res) {
    /* 
        #swagger.tags = ['Todo-待辦事項']
        #swagger.description = '修改待辦事項' 
    */
    try {
        /*
            #swagger.parameters['id'] = {
                in: 'path',
                description: '需修改待辦事項的_id值',
                type: 'string'
            }

            #swagger.parameters['body'] = {
                in: 'body',
                description: '需修改欄位資料',
                schema: {
                    title: '',
                    memo: ''
                }
            }
        
        */

        const { id } = req.params;
        const { title, memo } = req.body;

        const updateData = {};

        if (title !== undefined && title !== '') {
            updateData['title'] = title;
        }
        if (memo !== undefined) {
            updateData['memo'] = memo;
        }

        const data = await todoModel
            .findOneAndUpdate({ _id: id },
                { $set: updateData }, 
                { new: true }).exec();
        
        res.status(200).json({
            success: true,
            data
        });

        /* 
            #swagger.responses[200] = {
                description: '成功'
            }
        */

    } catch(error) {
        /* 
            #swagger.responses[400] = {
                description: '錯誤',
                schema: {
                    success: false,
                    message: '錯誤內容'
                }
            }
        */
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}

// 刪除待辦事項
export async function remove(req, res) {
    /* 
        #swagger.tags = ['Todo-待辦事項']
        #swagger.description = '刪除待辦事項' 
    */
    try {
        /*
            #swagger.parameters['id'] = {
                in: 'path',
                description: '需刪除待辦事項_id值',
                type: 'string'
            }
        */
        const { id } = req.params;

        await todoModel
            .findByIdAndUpdate(id, { 
                $set: { isDelete: true }
            }).exec();

        /* 
            #swagger.responses[200] = {
                description: '成功',
                schema: {
                    success: true,
                    msg: '已刪除成功!'
                }
            }
        */
        res.json({
            success: true,
            msg: '已刪除成功!'
        });   
    } catch(error) {
        /* 
            #swagger.responses[400] = {
                description: '錯誤',
                schema: {
                    success: false,
                    message: '錯誤內容'
                }
            }
        */
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}

// 待辦狀態更新
export async function updateState(req, res) {
    /* 
        #swagger.tags = ['Todo-待辦事項']
        #swagger.description = '待辦done狀態更新' 
    */
    try {
        /* 
            #swagger.parameters['id'] = {
                in: 'path',
                description: '需更新待辦done狀態紀錄_id值',
                type: 'string'
            }

            #swagger.parameters['body'] = {
                in: 'body',
                description: '',
                schema: {
                    updateDoneState: true
                }
            }
        */
        const { id } = req.params;

        const { updateDoneState } = req.body;

        await todoModel
            .findByIdAndUpdate(id, { 
                $set: { done: Boolean(updateDoneState) }
            }).exec();

        /* 
            #swagger.responses[200] = {
                description: '成功',
                schema: {
                    success: true,
                    message: '狀態已更新成功!'
                }
            }
        */
        res.json({
            success: true,
            msg: '狀態已更新成功!'
        });   
    } catch(error) {
        /* 
            #swagger.responses[400] = {
                description: '錯誤',
                schema: {
                    success: false,
                    message: '錯誤內容'
                }
            }
        */
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}
