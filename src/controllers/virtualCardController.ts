import { Request, Response } from "express";
import * as virtualCardServices from "../services/virtualCardServices.js"


export async function postVirtualCard(req: Request, res: Response){
    const {id} = req.params
    const {password} = req.body
    await virtualCardServices.createVirtualCard(Number(id), password)
    res.sendStatus(201)
}
export async function deleteVirtualCard(req: Request, res: Response){
    const {id} = req.params
    const {password} = req.body
    await virtualCardServices.deleteVirtualCard(Number(id), password)
    res.sendStatus(200)
}
