import Joi from 'joi';

export const chuyenMucSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    products: Joi.array(),
})