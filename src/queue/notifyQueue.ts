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
    try {
        const result = await notifyChannels.nodeMailerChannel(job.data);

        if (result) {
            const channelUsed = result === 1 ? 'main channel' : 'second channel';
            Logger.info(`Email sent successfully using ${channelUsed}`, [job.data]);
        } else {
            Logger.warn('Failed to send email', [job.data]);
        }
        return result;
    } catch (error) {
        Logger.error('Error processing email', [error]);
        throw error;
    }
};

export { processEmailQueue, sendNewEmail, emailQueue };
