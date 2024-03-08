import accountsModel from '../models/accountsModel.js';
import { toDate, format } from 'npm:date-fns';



export async function getList(req, res) {
    /* 	
        #swagger.tags = ['Accounts']
        #swagger.description = '取得記帳本列表資料'
    */

    const { page, limit, date } = req.query;

    const queryRule = { isDelete: false };

    if (date !== undefined && typeof date === 'string') {
        queryRule['incomeAndExpenditureDate'] = {
            $gte: new Date(`${date}-01T00:00:00`),
            $lte: new Date(`${date}-31T23:59:59`)
        };
    } else {
        const dateYearMonth = format(new Date(), 'yyyy-MM');
        
        queryRule['incomeAndExpenditureDate'] = {
            $gte: new Date(`${dateYearMonth}-01T00:00:00`),
            $lte: new Date(`${dateYearMonth}-31T23:59:59`)
        };
    }

    try {
        const result = await accountsModel
            .paginate(queryRule, 
                {
                    page: page || 1,
                    limit: limit || 10,
                    sort: { createdAt: -1 }
                });

        res.json({
            success: true,
            ...result
        });
    } catch(error) {
        res.status(400).json({ 
            success: false,
            msg: error.message
        });
    }
}

export async function create(req, res) {
    /* 	
        #swagger.tags = ['Accounts']
        #swagger.description = '建立記帳本資料'
    */
    const { title, incomeAndExpenditureDate, type, amount, memo } = req.body;

    try {
        const errorKeys = [];

        const newData = {};
        if (typeof title === 'string' && title !== '') {
            newData['title'] = title;
        } else {
            errorKeys.push('title');
        }

        if (typeof incomeAndExpenditureDate === 'string' && 
                incomeAndExpenditureDate !== '') {
            newData['incomeAndExpenditureDate'] = toDate(incomeAndExpenditureDate);
        } else {
            errorKeys.push('incomeAndExpenditureDate');
        }

        if (typeof type === 'number' && (type === 1 || type === -1)) {
            newData['type'] = type;
        } else {
            errorKeys.push('type');
        }

        if (typeof amount === 'number' && amount > 0) {
            newData['amount'] = amount;
        } else {
            errorKeys.push('amount');
        }

        if (typeof memo === 'string') {
            if (memo !== '') {
                newData['memo'] = memo;
            }
        } else {
            errorKeys.push('memo');
        }

        if (errorKeys.length > 0) {
            return res.json({
                success: false,
                data: null,
                msg: `以下欄位 ${errorKeys.join(',')} 資料格式錯誤!`
            });
        }

        const data = await accountsModel.create(newData);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            msg: error.message
        });
    }
}

export async function update(req, res) {
    /* 	
        #swagger.tags = ['Accounts']
        #swagger.description = '更新記帳本資料'
    */
    const { id } = req.params;
    const { title, incomeAndExpenditureDate, type, amount, memo } = req.body;

    try {
        const errorKeys = [];
        const updateData = {};
        if (title !== undefined) {
            if (typeof title === 'string' && title !== '') {
                updateData['title'] = title;
            } else {
                errorKeys.push('title');
            }
        }
        
        if (incomeAndExpenditureDate !== undefined) {
            if (typeof incomeAndExpenditureDate === 'string' && 
                incomeAndExpenditureDate !== '') {
                updateData['incomeAndExpenditureDate'] = toDate(incomeAndExpenditureDate);
            } else {
                errorKeys.push('incomeAndExpenditureDate');
            }
        }
        
        if (type !== undefined) {
            if (typeof type === 'number' && (type === 1 || type === -1)) {
                updateData['type'] = type;
            } else {
                errorKeys.push('type');
            }
        }
        
        if (amount !== undefined) {
            if (typeof amount === 'number' && amount > 0) {
                updateData['amount'] = amount;
            } else {
                errorKeys.push('amount');
            }
        }
        
        if (memo !== undefined) {
            if (typeof memo === 'string' && memo !== '') {
                updateData['memo'] = memo;
            } else {
                errorKeys.push('amount');
            }
        }

        if (errorKeys.length > 0) {
            return res.json({
                success: false,
                data: null,
                msg: `以下欄位 ${errorKeys.join(',')} 資料格式錯誤!`
            });
        }

        updateData['updatedAt'] = toDate(Date.now());

        const updateAfterData = await accountsModel
            .findByIdAndUpdate(id,
            {
                $set: updateData
            }, { new: true }).exec();

        res.json({
            success: true,
            data: updateAfterData
        });

    } catch (error) {
        res.json({
            success: false,
            msg: error.message
        });
    }
}

export async function remove(req, res) {
    /* 	
        #swagger.tags = ['Accounts']
        #swagger.description = '刪除記帳本資料'
    */
    try {
        const { id } = req.params;

        await accountsModel
            .findByIdAndUpdate(id, { 
                $set: { isDelete: true }
            }).exec();

        res.json({
            success: true,
            msg: '已刪除成功!'
        });   
    } catch(error) {
        res.status(400).json({ 
            success: false,
            msg: error.message
        });
    }
}