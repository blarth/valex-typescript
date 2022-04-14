
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import router from "./routers/index.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use((error : Error, req : Request, res : Response, next : NextFunction) => {
  /* if (error.type === "invalid_entity") return res.sendStatus(422);
  if (error.type === "auth_error") return res.sendStatus(401); */
  return res.sendStatus(500);
})
app.use(router)


export default app;
