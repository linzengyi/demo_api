import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import usersModel from "../models/usersModle.js";
import tokenModel from '../models/tokenModel.js';
import { addHours, isAfter, toDate } from 'date-fns';


function tokenValid(tokenData) {
    let checkResult = false;
    const toeknValidDataTime = addHours(tokenData.createdAt, 1);
    // 當前日期時間
    const currentDateTime = toDate(Date.now());
    console.log('toeknValidDataTime', toeknValidDataTime);
    console.log('currentDataTime', currentDateTime);
    console.log(isAfter(currentDateTime, toeknValidDataTime));
    // 當前日期時間 在 token有效日期時間 之後
    if (isAfter(currentDateTime, toeknValidDataTime)) {
        checkResult = true;
    }
    return checkResult;
}



export async function getUser(req, res) {
    /* 	
        #swagger.tags = ['User']
        #swagger.description = '取得帳號資料'
    */
    const { authorization: token } = req.headers;

    // token 驗證
    if (token === undefined) {
        return res.status(400).json({ success: false, msg: 'token無效' });
    }

    const _token = token.split(' ')[1];

    const tokenData = await tokenModel.findOne({ token: _token }).exec();
    
    if (tokenData === null || tokenData.state !== '') {
        return res.status(400).json({ success: false, msg: 'token無效1' });
    }

    if (tokenValid(tokenData)) {
        return res.status(400).json({ success: false, msg: 'token無效2' });
    }

    try {
        const decode = await jwt.verify(_token, process.env.KEY);

        console.log('取得token user資料', decode);
        /*
        {
            _id: '65d41e95a553adb609da023c',
            name: 'Joe',
            photo: '',
            iat: 1708400461
        }
        */

        const data = await usersModel
            .findById(decode._id, ['_id', 'name', 'photo']).exec();

        res.json({
            success: true,
            data
        });

    } catch (error) {
        res.status(400).json({ success: false, msg: error.message});
    }
}

export async function createUser(req, res) {
    /* 	
        #swagger.tags = ['User']
        #swagger.description = '建立帳號資料'
    */

    const { account, password, name } = req.body;

    const exist = await usersModel.countDocuments({ account }).exec();

    if (exist > 0) {
        return res.status(400).json({ success: false, mag: '帳號已存在' });
    }

    // 密碼hash
    const hashPassword = await bcrypt.hash(password, 8);

    // 產生User資料並儲存
    const userData = {
        account,
        password: hashPassword,
        name
    };

    const data = await usersModel.create(userData);

    res.json({
        success: true,
        user: {
            _id: data._id,
            name: data.name
        }
    });
}

export async function updateUser(req, res) {
    /* 	
        #swagger.tags = ['User']
        #swagger.description = '更新帳號資料'
    */
    const { authorization: token } = req.headers;
    
    // token 驗證
    if (token === undefined) {
        return res.status(400).json({ success: false, msg: 'token無效' });
    }

    const _token = token.split(' ')[1];
    
    const tokenData = await tokenModel.findOne({ token: _token }).exec();
    
    if (tokenData === null || tokenData.state !== '') {
        return res.status(400).json({ success: false, msg: 'token無效1' });
    }

    if (tokenValid(tokenData)) {
        return res.status(400).json({ success: false, msg: 'token無效2' });
    }

    try {
        const decode = await jwt.verify(_token, process.env.KEY);

        const { name, photo } = req.body;

        const updateData = {
            $set: {
                name
            }
        };

        if (photo !== undefined || photo !== '') {
            updateData['$set']['photo'] = photo;
        }

        const result = await usersModel.findByIdAndUpdate(decode._id, updateData).exec();

        console.log('更新回傳資訊', result);
        /* 
            {   更新前紀錄
                _id: new ObjectId('65d41e95a553adb609da023c'),
                account: 'aaa@gmail.com',
                password: '$2b$10$anXwDF7wc4NZJ1iZ72kVDu1hReGw5Ax4pZlxj/mFkBcPE6kI3D1dm',
                name: 'Joe',
                photo: '',
                createdAt: 2024-02-20T03:37:57.555Z,
                updatedAt: 2024-02-20T03:37:57.555Z,
                __v: 0
            }
        
        */

        res.json({
            success: true,
            msg: '更新成功'
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
}

export async function checkAccount(req, res) {
    /* 	
        #swagger.tags = ['User']
        #swagger.description = '帳號存在檢核'
    */
    const { account } = req.body;

    const exist = await usersModel.countDocuments({ account }).exec();

    console.log(exist);

    if (exist > 0) {
        return res.status(400).json({ success: false, mag: '帳號已存在' });
    }

    res.json({ success: true });
}