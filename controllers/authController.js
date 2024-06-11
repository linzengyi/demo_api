import "dotenv/config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import usersModel from "../models/usersModle.js";
import tokenModel from '../models/tokenModel.js';


const Key = process.env.KEY;


export async function login(req, res) {
    /* 	
        #swagger.tags = ['Auth-授權']
        #swagger.description = '帳號登入' 
    */
    /*
        #swagger.parameters['body'] = {
            in: 'body',
            description: '登入資料',
            '@schema': { 
                required: ['account', 'password', 'identity'], 
                properties: { 
                    account: { 
                        type: 'string', 
                        description: '帳號(email)',
                        example: 'demo@gmail.com' 
                    },
                    password: { 
                        type: 'string', 
                        description: '登入密碼',
                        example: '123456' 
                    },
                    identity: { 
                        type: 'string', 
                        description: '登入角色',
                        example: 'devloper' 
                    }

                } 
            } 
        }
    */
    const { account, password, identity } = req.body;

    const userData = await usersModel
                    .findOne({ account }).exec();

    /* 
        #swagger.responses[400] = {
            description: '錯誤',
            schema: {
                success: false,
                message: '錯誤內容'
            }
        }
    */

    if (!userData) {
        return res.status(400).json({ success: false, msg: '帳號不存在!' });
    }

    const result = await bcrypt.compare(password, userData.password);

    if (!result) {
        return res.status(400).json({ success: false, msg: '密碼錯誤!' });
    }

    const token = await jwt.sign({ 
        _id: userData._id,
        name: userData.name,
        photo: userData.photo || '' }, Key);

    /* 
        token寫入資料庫
    */
    await tokenModel.create({ 
        loginUserId: userData._id,
        token
     });

    /* 
        #swagger.responses[200] = {
            description: '成功',
            schema: {
                success: true,
                token: '__qqfdfdfsdfsgd.....',
                identity: 'devloper'
            }
        }
    */
    res.status(200).json({
        success: true,
        token,
        identity
    });
}

export async function logout(req, res) {
    /* 	
        #swagger.tags = ['Auth-授權']
        #swagger.description = '帳號登出' 
    */

    /*
        #swagger.security = [{
            "apiKeyAuth": [{
                type: 'apiKey',
                in: 'header', // can be 'header', 'query' or 'cookie'
                name: 'authorization', // name of the header, query parameter or cookie
                description: '登入取得token'
            }]
        }] 
    */
    const { authorization: token } = req.headers;

    const _token = token.split(' ')[1];

    /* 
        寫入資料庫token註銷
    */
    await tokenModel.findOneAndUpdate({ token: _token }, { $set: { state: 'F' }}).exec();

    /* 
        #swagger.responses[200] = {
            description: '成功',
            schema: {
                success: true,
                msg: '已登出',
                token: '__qqfdfdfsdfsgd.....'
            }
        }
    */
    res.send({ success: true, msg: '已登出' });
}

