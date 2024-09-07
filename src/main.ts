// Main file for notification srever from where the app starting run.


import express from "express";
import Logger from "./log/logger";
import router from "./router/router";
import { sesEmailQueue , processSesEmailQueue, pinpointEmailQueue, processPinpointEmailQueue } from "./queue/notifyQueue";



const app = express();


app.use(express.json());

app.use("/api/",router);

sesEmailQueue.process(processSesEmailQueue);

pinpointEmailQueue.process(processPinpointEmailQueue);


app.listen("8000",()=>{

    Logger.info("Server running on http://localhost:8000");

});

