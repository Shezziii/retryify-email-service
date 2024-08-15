// Main file for notification srever from where the app starting run.


import express from "express";
import Logger from "./log/logger";
import router from "./router/router";
import { emailQueue , processEmailQueue } from "./queue/notifyQueue";



const app = express();


app.use(express.json());

app.use("/api/",router);

emailQueue.process(processEmailQueue);

app.listen("8000",()=>{

    Logger.info("Server running on http://localhost:8000");

});

