import { Router } from "express";
import * as middlewaresValidate from "../middlewares/verifySchemaMiddleware.js";
import passwordSchema from "../schemas/schemaPassword.js";
import * as virtualCardController from "../controllers/virtualCardController.js"


const virtualCardRouter = Router()

virtualCardRouter.post("/virtualcard/:id", middlewaresValidate.default(passwordSchema), virtualCardController.postVirtualCard)
virtualCardRouter.post("/virtualcard/:id/delete", middlewaresValidate.default(passwordSchema), virtualCardController.deleteVirtualCard)

export default virtualCardRouter