import { Request, Response } from "express";
import * as onlinePaymentService from "../services/onlinePaymentService.js"

export async function postOnlinePayment(req: Request, res: Response){
    const {idBusiness} = req.params
    const {cardNumber, cardholderName, expirationDate, securityCode, amount} = req.body
    const idNumberBusiness : number = parseInt(idBusiness)
    await onlinePaymentService.onlinePayment(cardNumber, cardholderName, expirationDate, securityCode, idNumberBusiness, amount)
    res.sendStatus(200)
}