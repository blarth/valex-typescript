import { Router } from "express";
import { postCard } from "../controllers/cardController.js";
import { verifyKeyApi } from "../middlewares/verifyApiKeyMiddleware.js";
import * as middlewaresValidate from "../middlewares/verifySchemaMiddleware.js";
import cardSchema from "../schemas/schemaCard.js";

const cardRouter = Router()

cardRouter.post("/create-card", middlewaresValidate.default(cardSchema), verifyKeyApi, postCard)

export default cardRouter