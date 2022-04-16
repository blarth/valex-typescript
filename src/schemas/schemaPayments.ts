import Joi from "joi";

const paymentSchema = Joi.object({
    amount: Joi.number().min(0).required(),
    password: Joi.string().required(),
  });
  
  export default paymentSchema;