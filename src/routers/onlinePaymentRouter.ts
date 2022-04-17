import { Router } from "express";
import * as middlewaresValidate from "../middlewares/verifySchemaMiddleware.js";
import onlinePaymentSchema from "../schemas/schemaOnlinePayments.js";
import * as onlinePaymentController from "../controllers/onlinePaymentsController.js"


const onlinePaymentRouter = Router()

onlinePaymentRouter.post("/onlinepayment/:idBusiness", middlewaresValidate.default(onlinePaymentSchema), onlinePaymentController.postOnlinePayment)

export default onlinePaymentRouter