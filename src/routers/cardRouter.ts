import { Router } from "express";
import { activateCard, postCard } from "../controllers/cardController.js";
import { verifyKeyApi } from "../middlewares/verifyApiKeyMiddleware.js";
import * as middlewaresValidate from "../middlewares/verifySchemaMiddleware.js";
import activateSchema from "../schemas/schemaActivate.js";
import cardSchema from "../schemas/schemaCard.js";

const cardRouter = Router()

cardRouter.post("/create-card", middlewaresValidate.default(cardSchema), verifyKeyApi, postCard)
cardRouter.post("/activate-card/:id", middlewaresValidate.default(activateSchema), verifyKeyApi, activateCard)

export default cardRouter