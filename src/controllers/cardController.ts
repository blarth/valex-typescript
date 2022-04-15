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
    const idNumber : number = parseInt(id) 

    await cardService.activateCard(idNumber, securityCode, password)
    res.sendStatus(201)
}