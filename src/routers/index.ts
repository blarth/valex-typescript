import { Router } from "express";
import cardRouter from "./cardRouter.js";
import onlinePaymentRouter from "./onlinePaymentRouter.js"
import virtualCardRouter from "./virtualCardRouter.js";


const router = Router();

router.use(cardRouter)
router.use(onlinePaymentRouter)
router.use(virtualCardRouter)

export default router;