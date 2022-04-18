import { Request, Response, NextFunction } from "express"

export default function handleErrors(
    error : any, req: Request, res: Response, next: NextFunction
  ) {
      console.log(error)
    if (error) {
      return res.status(error.statusCode).send(error.message)
    }
  
    res.sendStatus(500);
}