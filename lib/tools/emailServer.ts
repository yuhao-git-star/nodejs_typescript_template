
import * as nodemailer from 'nodemailer';
import { mailConfig } from '../config/config';
export class MailServer {

    public transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailConfig.user,
                pass: mailConfig.password
            }
        });
    }

    public static sendEMail(transporter: nodemailer.Transporter,
        mailContext: nodemailer.SendMailOptions) {
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailContext, function (error, info) {
                if (error) {
                    reject(error);
                }
                console.log('mail sent:', info.response);
                resolve(info.response);
            });
        });
    }
}

export const mailTransporter = new MailServer().transporter;

