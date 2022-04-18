import { Request, Response } from "express";
import * as cardService from "../services/cardServices.js"

export async function postCard(req: Request, res: Response){
    const {apiKey} = res.locals
    const {employeeId, type} = req.body
    await cardService.createCard(apiKey, employeeId, type)
    res.sendStatus(201)
}

export async function activateCard(req: Request, res: Response){
    const {id} = req.params
    const {securityCode, password} = req.body
    await cardService.activateCard(Number(id), securityCode, password)
    res.sendStatus(201)
}

export async function getCardBalance(req: Request, res: Response){
    const {id} = req.params
    res.send(await cardService.getBalance(Number(id)))
}

export async function rechargeCard(req: Request, res: Response){
    const {id} = req.params
    const {amount} = req.body
    await cardService.recharge(Number(id), amount)
    res.sendStatus(201)
}

export async function postPayment(req: Request, res: Response){
    const {id, idBusiness} = req.params
    const {amount, password} = req.body
    await cardService.payment(Number(id), password, Number(idBusiness), amount)
    res.sendStatus(200)
}

export async function patchBlockUnBlockCard(req: Request, res: Response){
    const {id} = req.params
    const {password} = req.body
    const actionPath = req.path
    actionPath.split("/")[3] === 'block' ? await cardService.blockCard(Number(id), password) : await cardService.unBlockCard(Number(id), password)
    res.sendStatus(200)
}



