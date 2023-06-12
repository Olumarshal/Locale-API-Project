import Joi from 'joi';

const localeQuerySchema = Joi.object({
  name: Joi.string().optional(),
  metadata: Joi.object().optional(),
  state: Joi.string().optional(),
  lga: Joi.string().optional(),
  tribes: Joi.string().optional(),
  population: Joi.string().optional(),
  area: Joi.string().optional(),
});

export default localeQuerySchema;
