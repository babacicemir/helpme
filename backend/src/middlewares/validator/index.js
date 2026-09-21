const Joi = require('joi')

const createUserSchema = Joi.object({
    first_name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.base': 'First name should be a type of text',
            'string.empty': 'First name cannot be an empty field',
            'string.min': 'First name should have a minimum length of {#limit}',
            'string.max': 'First name should have a maximum length of {#limit}',
            'any.required': 'First name is a required field'
        }),

    last_name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.base': 'Last name should be a type of text',
            'string.empty': 'Last name cannot be an empty field',
            'string.min': 'Last name should have a minimum length of {#limit}',
            'string.max': 'Last name should have a maximum length of {#limit}',
            'any.required': 'Last name is a required field'
        }),

    username: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Username should be a type of text',
            'string.empty': 'Username cannot be an empty field',
            'string.min': 'Username should have a minimum length of {#limit}',
            'string.max': 'Username should have a maximum length of {#limit}',
            'any.required': 'Username is a required field'
        }),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .required()
        .messages({
            'string.base': 'Email should be a type of text',
            'string.empty': 'Email cannot be an empty field',
            'string.email': 'Email should be a valid email address',
            'string.max': 'Email should have a maximum length of {#limit}',
            'any.required': 'Email is a required field'
        }),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password cannot be an empty field',
            'string.min': 'Password should have a minimum length of {#limit}',
            'string.max': 'Password should have a maximum length of {#limit}',
            'any.required': 'Password is a required field'
        }),

    bio: Joi.string()
        .trim()
        .max(1000)
        .allow('', null)
        .messages({
            'string.base': 'Bio should be a type of text',
            'string.max': 'Bio should have a maximum length of {#limit}'
        }),

    profile_img: Joi.string()
        .uri()
        .allow('', null)
        .messages({
            'string.base': 'Profile image should be a type of text',
            'string.uri': 'Profile image should be a valid URL'
        }),

    location: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.base': 'Location should be a type of text',
            'string.empty': 'Location cannot be an empty field',
            'string.min': 'Location should have a minimum length of {#limit}',
            'string.max': 'Location should have a maximum length of {#limit}',
            'any.required': 'Location is a required field'
        })
})


function validateCreateUser(req, res, next) {
    const { error, value } = createUserSchema.validate(
        req.body,
        { abortEarly: false }
    )

    if (error) {
        const errorMessages = error.details.map(
            (detail) => detail.message
        )

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorMessages
        })
    }

    req.body = value
    next()
}

const loginSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .messages({
            'string.base': 'Username should be a type of text',
            'string.empty': 'Username cannot be an empty field',
            'string.min': 'Username should have a minimum length of {#limit}',
            'string.max': 'Username should have a maximum length of {#limit}'
        }),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .messages({
            'string.base': 'Email should be a type of text',
            'string.empty': 'Email cannot be an empty field',
            'string.email': 'Email should be a valid email address',
            'string.max': 'Email should have a maximum length of {#limit}'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password cannot be an empty field',
            'any.required': 'Password is a required field'
        })
}).or('username', 'email')
    .messages({
        'object.missing': 'Username or email is required'
    })


function validateLogin(req, res, next) {
    const { error, value } = loginSchema.validate(
        req.body,
        { abortEarly: false }
    )

    if (error) {
        const errorMessages = error.details.map(
            (detail) => detail.message
        )

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorMessages
        })
    }

    req.body = value
    next()
}

module.exports = {
    validateCreateUser,
    validateLogin
}