import Joi from "joi";

const onlinePaymentSchema = Joi.object({
  cardNumber: Joi.string().required(),
  cardholderName: Joi.string().required(),
  expirationDate: Joi.string().required(),
  securityCode: Joi.string().required(),
  amount: Joi.number().min(0).required(),
});

export default onlinePaymentSchema;
