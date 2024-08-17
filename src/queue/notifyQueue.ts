// File for Queue..

import Bull, { Job } from 'bull';
import Logger from '../log/logger';
import { notifyChannels } from '../helper/notifyChannels';

// Define the email queue
const emailQueue = new Bull('email');

// Email type definition
type EmailType = {
    from: string;
    to: string;
    subject: string;
    text: string;
};

// Add email job to the queue
const sendNewEmail = async (email: EmailType) => {
    await emailQueue.add(email);
    return true;
};

// Process the email job
const processEmailQueue = async (job: Job<EmailType>) => {
    const maxAttempts = 3; 
    const retryDelay = 5000; 

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            Logger.warn(`Attempt ${attempt}: `);
            const result = await notifyChannels.mailUsingCred(job.data);
            if (result) {
                Logger.warn(`Attempt ${attempt}: Passed.`);
                return result;
            } else {
                const fallbackResult = await notifyChannels.mailUsingTestAccount(job.data);
                if (fallbackResult) {
                    Logger.warn(`Attempt ${attempt}: Passed.`);
                    return fallbackResult;
                }
            }
            
            Logger.warn(`Attempt ${attempt}: Failed.`);
            if (attempt === maxAttempts) {
                Logger.error('All attempts failed. Email could not be sent.');
            }
        } catch (error) {
            Logger.error('Error occure while sending...');
        }
        await new Promise(res => setTimeout(res, retryDelay)); 
    }
};


export { processEmailQueue, sendNewEmail, emailQueue };
