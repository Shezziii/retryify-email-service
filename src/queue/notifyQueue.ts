import Bull, { Job } from 'bull';
import Logger from '../log/logger';
import { notifyChannels } from '../helper/notifyChannels';

const sesEmailQueue = new Bull('ses_mail');
const pinpointEmailQueue = new Bull('pinpoint_mail');

type EmailType = {
    from: string;
    to: string;
    subject: string;
    text: string;
};

const queueOptions = {
    attempts: 3,
    backoff: 5000,
};

// Add email job to SES queue
const sendNewEmail = async (email: EmailType) => {
    await sesEmailQueue.add(email, queueOptions);
    return true;
};

// Add email job to Pinpoint queue
const sendEmailToPinpoint = async (email: EmailType) => {
    await pinpointEmailQueue.add(email, queueOptions);
    return true;
};

// Process SES email jobs
const processSesEmailQueue = async (job: Job<EmailType>) => {
    try {
        Logger.warn(`Attempt ${job.attemptsMade}: Sending email via SES.`);
        const result = await notifyChannels.mailUsingCred(job.data);

        if (result) {
            Logger.info(`Email sent successfully via SES on attempt ${job.attemptsMade}.`);
            return result;
        } else {
            throw new Error('Failed to send email via SES.');
        }

    } catch (error) {
        Logger.error(`Error during SES email attempt ${job.attemptsMade}: `);

        if (job.attemptsMade >= 2) {
            Logger.warn(`Max attempts reached for SES. Switching to Pinpoint.`);
            await sendEmailToPinpoint(job.data);
        }

        throw error;
    }
};

// Process Pinpoint email jobs
const processPinpointEmailQueue = async (job: Job<EmailType>) => {
    try {
        Logger.warn(`Attempt ${job.attemptsMade}: Sending email via Pinpoint.`);
        const result = await notifyChannels.mailUsingTestAccount(job.data);

        if (result) {
            Logger.info(`Email sent successfully via Pinpoint on attempt ${job.attemptsMade}.`);
            return result;
        } else {
            throw new Error('Failed to send email via Pinpoint.');
        }

    } catch (error) {
        Logger.error(`Error during Pinpoint email attempt ${job.attemptsMade}: `);

        if (job.attemptsMade >= 3) {
            Logger.warn(`Max attempts reached for Pinpoint. All channels failed.`);
        }

        throw error;
    }
};

export { processSesEmailQueue, sendNewEmail, sesEmailQueue, pinpointEmailQueue, processPinpointEmailQueue };
