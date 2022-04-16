import Joi from "joi";

const amountSchema = Joi.object({
  amount: Joi.number().min(0).required(),
});

export default amountSchema;


