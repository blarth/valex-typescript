import Joi from "joi";

const activateSchema = Joi.object({
    securityCode: Joi.string().required(),
    password: Joi.string().required(),
  });
  
  export default activateSchema;