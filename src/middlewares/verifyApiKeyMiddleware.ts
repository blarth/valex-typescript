import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService.js"

export async function verifyKeyApi(req: Request, res : Response, next : NextFunction) {
    
    const apiKey : any = req.headers['x-api-key']
    if(!apiKey) throw {type : "auth_error" , message : "API Key missing"}
    const validCompany = await authService.validateCompany(apiKey)
    res.locals.apikey = apiKey
    next()
}