// First Channel for send Email using NOde Mailer.

import nodemailer from 'nodemailer';
import Logger from '../log/logger';

export class notifyChannels {

    //Mail using Main function or channel.
    static async mailUsingCred(data: {
        from: string;
        to: string;
        subject: string;
        text: string;
        html?: string;
    }) {
        try {
            Logger.info('Preparing to send email', [data]);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'Your Email.',
                    pass: 'Your Pass.',
                },
                secure: true,
                port: 465,
            });

            const info = await transporter.sendMail({
                from: data.from,
                to: data.to,
                subject: data.subject,
                text: data.text,
                html: data.html,
            });

            Logger.info(`Message sent: ${info.messageId}`);
            // Logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

            return true;
        } catch (error: any) {
            
            return false;
        }
    }

    //Mail using Secound function or channel.
    static async mailUsingTestAccount(data: {
        from: string;
        to: string;
        subject: string;
        text: string;
        html?: string;
    }) {
        try {
            Logger.info('Attempting to send email using fallback method', [data]);

            // Use a test account.
            const testAccount = await nodemailer.createTestAccount();

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const fallbackInfo = await transporter.sendMail({
                from: data.from,
                to: data.to,
                subject: data.subject,
                text: data.text,
                html: data.html,
            });

            Logger.info(`Fallback message sent: ${fallbackInfo.messageId}`);
            Logger.info(`Fallback preview URL: ${nodemailer.getTestMessageUrl(fallbackInfo)}`);

            return true;
        } catch (fallbackError: any) {
           return false;
        }
    }
}

