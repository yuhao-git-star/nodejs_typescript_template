import * as express from 'express';
import { Request, Response } from 'express';
import { Router } from 'express';
import { User, UserSchema } from '../models/user';
import * as jwt from 'jsonwebtoken';
import logger from '../log/logger';
import { config } from '../config/config';
import { mailTransporter, MailServer } from '../tools/emailServer';
import * as moment from 'moment';

/**
 * @api {post} /account/signup 使用者註冊
 * @apiVersion 1.0.0
 * @apiName SignupUser
 * @apiGroup User
 * @apiPermission none
 * 
 * @apiParam {String} name 使用者名稱
 * @apiParam {String} email 使用者 email(登入帳號)
 * @apiParam {String} password 使用者密碼
 * @apiParam {String} emailContext 註冊成功 email 內容
 * @apiSuccessExample Response (example):
 *     HTTP/1.1 200 註冊成功
 *     {
 *       "success": "true",
 *       "message: "享受你的token吧",
 *       "token": "is jwt token"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 重複註冊
 *     {
 *       "success": "false",
 *       "message": "帳號已經存在"
 *     }
 */

 /**
 * @api {post} /account/login 使用者登入
 * @apiVersion 1.0.0
 * @apiName LoginUser
 * @apiGroup User
 * @apiPermission none
 * 
 * @apiParam {String} email 使用者 EMail(登入帳號)
 * @apiParam {String} password 使用者密碼
 * @apiSuccessExample Response (example):
 *     HTTP/1.1 200 登入成功
 *     {
 *       "success": "true",
 *       "message: "享受你的token吧",
 *       "token": "is jwt token"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 登入失敗
 *     {
 *       "success": "false",
 *       "message": "登入失敗，找不到使用者"
 *     }
 */

class Accounts {

    public accountRouter: Router;

    constructor() {
        this.accountRouter = Router();
        this.setupAccountRouter();
    }

    private setupAccountRouter() {
        
        this.accountRouter.route('/signup')
            .post((req: Request, res: Response, next) => {
                this.userSignup(req, res);
            });

        this.accountRouter.route('/login')
            .post((req: Request, res: Response, next) => {
                this.userLogin(req, res);
            });
    }

    private userSignup(req: Request, res: Response) {
        const data = req.body;
        if (!(data.name || data.email || data.password)) {
            res.json({
                success: false,
                message: '請確認使用者註冊資訊'
            })
            return;
        }

        const user = new UserSchema();
        user.name = data.name;
        user.email = data.email;
        user.password = data.password;
        user.picture = User.gravatar(user);

        UserSchema.findOne({ email: data.email }, (err, existingUser) => {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString()
                })
            } err;
            if (existingUser) {
                logger.log('warn', user.email + '帳號重複註冊');
                res.json({
                    success: false,
                    message: '帳號已經存在'
                })
            } else {
                try {
                    user.save();
                    logger.log('info', user.email + '使用者註冊成功');
                    var token = jwt.sign({
                        user: user
                    }, config.secret, {
                            expiresIn: '7d'
                        });

                    res.json({
                        success: true,
                        message: '享受你的token吧',
                        token: token
                    })
                    const date = moment().format('YYYY-MM-DD HH:mm ZZ');
                    const emailContext = data.emailContext ? data.emailContext : '恭喜註冊成功！';
                    const mail = {
                        to: user.email,
                        subject: '歡迎註冊！',
                        text: emailContext + date + '\n歡迎使用 yasuoyuhao-RESTful-API，本服務供練習使用。'
                    };
                    MailServer.sendEMail(mailTransporter, mail)
                } catch (e) {
                    console.log(e.toString());
                }
            }
        });
    }

    private userLogin(req: Request, res: Response) {
        UserSchema.findOne({ email: req.body.email }, (err, user) => {

            if (err) throw err;

            if (!user) {

                res.json({
                    success: false,
                    message: '登入失敗，找不到使用者'
                });

            } else if (user) {

                var validPassword = User.comparePassword(req.body.password, user);

                if (!validPassword) {
                    res.json({
                        success: false,
                        message: '登入失敗，請確認帳號或密碼'
                    });

                } else {

                    var token = jwt.sign({
                        user: user
                    }, config.secret, {
                            expiresIn: '7d'
                        });

                    res.json({
                        success: true,
                        message: '享受你的Token吧',
                        token: token
                    });
                }
            }
        });
    }

}

export const accountRouter = new Accounts().accountRouter;