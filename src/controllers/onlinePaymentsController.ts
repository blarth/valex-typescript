import { Request, Response } from "express";
import * as onlinePaymentService from "../services/onlinePaymentService.js"

export async function postOnlinePayment(req: Request, res: Response){
    const {idBusiness} = req.params
    const {cardNumber, cardholderName, expirationDate, securityCode, amount} = req.body
    await onlinePaymentService.onlinePayment(cardNumber, cardholderName, expirationDate, securityCode, Number(idBusiness), amount)
    res.sendStatus(200)
}