import Joi from 'joi';

const register = Joi.object({
    username: Joi.string()
        .required()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot exceed 30 characters',
            'string.pattern.base':
                'Username can only contain alphanumeric characters',
            'any.required': 'Username is required',
        }),
    email: Joi.string().required().email().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string()
        .required()
        .min(8)
        .pattern(
            new RegExp(
                '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            )
        )
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base':
                'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
            'any.required': 'Password is required',
        }),
});


const login = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'Username/Email is required',
    }),

    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    }),
});

export default { register, login };
