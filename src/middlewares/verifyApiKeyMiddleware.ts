import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService.js"
import * as error from "../utils/errorUtils.js"

export async function verifyKeyApi(req: Request, res : Response, next : NextFunction) {
    
    const apiKey : any = req.headers['x-api-key']
    if(!apiKey) throw error.authError("API Key missing")
    const validCompany = await authService.validateCompany(apiKey)
    res.locals.apikey = validCompany.apiKey
    next()
}