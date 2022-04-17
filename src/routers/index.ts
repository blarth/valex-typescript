import { Router } from "express";
import cardRouter from "./cardRouter.js";
import onlinePaymentRouter from "./onlinePaymentRouter.js"


const router = Router();

router.use(cardRouter)
router.use(onlinePaymentRouter)

export default router;