import { Router } from "express";
import * as cardControler from "../controllers/cardController.js";
import { verifyKeyApi } from "../middlewares/verifyApiKeyMiddleware.js";
import * as middlewaresValidate from "../middlewares/verifySchemaMiddleware.js";
import activateSchema from "../schemas/schemaActivate.js";
import cardSchema from "../schemas/schemaCard.js";
import amountSchema from "../schemas/schemaAmount.js";
import paymentSchema from "../schemas/schemaPayments.js";
import passwordSchema from "../schemas/schemaPassword.js";

const cardRouter = Router()

cardRouter.post("/card", middlewaresValidate.default(cardSchema), verifyKeyApi, cardControler.postCard)
cardRouter.post("/card/:id/activate", middlewaresValidate.default(activateSchema), verifyKeyApi, cardControler.activateCard)
cardRouter.get("/card/:id", verifyKeyApi, cardControler.getCardBalance)
cardRouter.post("/card/:id/recharge", middlewaresValidate.default(amountSchema),verifyKeyApi, cardControler.rechargeCard)
cardRouter.post("/card/:id/payment/:idBusiness", middlewaresValidate.default(paymentSchema), cardControler.postPayment)
cardRouter.put("/card/:id/block", middlewaresValidate.default(passwordSchema), cardControler.putBlockCard)
cardRouter.put("/card/:id/unblock", middlewaresValidate.default(passwordSchema), cardControler.putUnBlockCard)
export default cardRouter