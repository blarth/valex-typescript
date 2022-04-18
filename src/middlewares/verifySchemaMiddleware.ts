import { NextFunction, Request, Response } from "express";


export default function validateSchemaMiddleware(schema : any) {
    return (req : Request, res : Response, next : NextFunction) => {
      const validation = schema.validate(req.body);
      if (validation.error) {
        console.log(validation.error.message);
        return res.status(422).send(validation.error.message);
      }
      next();
    };
  }