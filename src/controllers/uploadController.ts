// Main Class for Notification Controller.

import express from 'express';
import Logger from '../log/logger';
import { sendNewEmail } from '../queue/notifyQueue';
import multer from "multer";
import path from 'path';

export class fileUploader {


static storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename(req, file, callback) {
         // Use the original file name and extension
        const ext = path.extname(file.originalname); 
        const baseName = path.basename(file.originalname, ext);
        const timestamp = Date.now(); 
        Logger.info('File Data ...'+` name : ${baseName} time : ${timestamp} extension : ${ext}`);
        const newFileName = `${baseName}_${timestamp}${ext}`;

        callback(null, newFileName);
    },
});
    static upload = multer({ storage: fileUploader.storage });

    static uploadFiles = async (request: express.Request, response: express.Response) => {
        try {
            Logger.info('Controller Calling..');
            
            return response.status(200).json({
                code: 1,
                message: 'Upload successfully',
            });

        } catch (error: any) {
            Logger.error('Error while uploading:', [error.message]);

            return response.status(500).json({
                code: 0,
                message: 'Failed to upload: ' + error.message,
            });
        }
    }
}
