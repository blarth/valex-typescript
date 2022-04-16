import Joi from "joi";

const passwordSchema = Joi.object({
    password: Joi.string().required(),
  });
  
  export default passwordSchema;