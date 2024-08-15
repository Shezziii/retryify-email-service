// main file for handling routers.

import { Router } from "express";
import { notifyController } from "../controllers/notifyController";

const router = Router();


router.post("/send-notification", notifyController.sendNotification);

router.all("*", (req, res) => {
    res.status(404).json({ code:0 , message : "Path Not Found." });
});

export default router;