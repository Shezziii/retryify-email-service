// Main Class for Notification Controller.

import express from 'express';
import Logger from '../log/logger';
import { sendNewEmail } from '../queue/notifyQueue';

export class notifyController {

    static sendNotification = async (request: express.Request, response: express.Response) => {
        try {
            Logger.info('Controller Calling..');

            const { from, to, subject, text } = request.body;

            await sendNewEmail({ from, to, subject, text });

            Logger.info('Email sent successfully', [request.body]);

            return response.status(200).json({
                code: 1,
                message: 'Email sent successfully',
            });

        } catch (error: any) {
            Logger.error('Error sending email:', [error.message]);

            return response.status(500).json({
                code: 0,
                message: 'Failed to send email: ' + error.message,
            });
        }
    }
}
