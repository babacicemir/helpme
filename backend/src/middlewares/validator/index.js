const Joi = require('joi')

const createUserSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must have at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters',
            'any.required': 'First name is required'
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must have at least 2 characters',
            'string.max': 'Last name cannot exceed 50 characters',
            'any.required': 'Last name is required'
        }),

    username: Joi.string()
        .alphanum()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Username is required',
            'string.alphanum': 'Username can only contain letters and numbers',
            'string.min': 'Username must have at least 3 characters',
            'string.max': 'Username cannot exceed 50 characters',
            'any.required': 'Username is required'
        }),

    email: Joi.string()
        .email()
        .max(255)
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
            'string.max': 'Email cannot exceed 255 characters',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must have at least 8 characters',
            'string.max': 'Password cannot exceed 50 characters',
            'string.pattern.base':
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
            'any.required': 'Password is required'
        }),

    location: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Location is required',
            'string.min': 'Location must have at least 2 characters',
            'string.max': 'Location cannot exceed 100 characters',
            'any.required': 'Location is required'
        }),

    bio: Joi.string()
        .max(500)
        .allow('', null)
        .messages({
            'string.max': 'Bio cannot exceed 500 characters'
        }),

    profileImg: Joi.string()
        .uri()
        .allow('', null)
        .messages({
            'string.uri': 'Profile image must be a valid URL'
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

const messageSchema = Joi.object({
    message: Joi.string()
        .trim()
        .min(1)
        .max(1000)
        .required()
        .messages({
            'string.empty': 'Message cannot be empty',
            'string.min': 'Message must contain at least 1 character',
            'string.max': 'Message cannot exceed 1000 characters',
            'any.required': 'Message is required'
        })
})

const validateCreateMessage = (req, res, next) => {
    const { error, value } = messageSchema.validate(
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

const validateCreateReplyMessage = (req, res, next) => {
    const { error, value } = messageSchema.validate(
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

const createJobSchema = Joi.object({
    categoryId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Category ID must be a number',
            'number.integer': 'Category ID must be an integer',
            'number.positive': 'Category ID must be a positive number',
            'any.required': 'Category is required'
        }),

    title: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title must contain at least 3 characters',
            'string.max': 'Title cannot exceed 100 characters',
            'any.required': 'Title is required'
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .required()
        .messages({
            'string.empty': 'Description cannot be empty',
            'string.min': 'Description must contain at least 10 characters',
            'string.max': 'Description cannot exceed 2000 characters',
            'any.required': 'Description is required'
        }),

    budget: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Budget must be a number',
            'number.positive': 'Budget must be greater than 0',
            'any.required': 'Budget is required'
        }),

    deadline: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'Deadline must be a valid date',
            'date.format': 'Deadline must be in a valid date format',
            'any.required': 'Deadline is required'
        }),

    location: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Location cannot be empty',
            'string.min': 'Location must contain at least 2 characters',
            'string.max': 'Location cannot exceed 100 characters',
            'any.required': 'Location is required'
        })
})

const updateJobSchema = Joi.object({
    categoryId: Joi.number()
        .integer()
        .positive()
        .messages({
            'number.base': 'Category ID must be a number',
            'number.integer': 'Category ID must be an integer',
            'number.positive': 'Category ID must be a positive number'
        }),

    title: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title must contain at least 3 characters',
            'string.max': 'Title cannot exceed 100 characters'
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .messages({
            'string.empty': 'Description cannot be empty',
            'string.min': 'Description must contain at least 10 characters',
            'string.max': 'Description cannot exceed 2000 characters'
        }),

    budget: Joi.number()
        .positive()
        .messages({
            'number.base': 'Budget must be a number',
            'number.positive': 'Budget must be greater than 0'
        }),

    deadline: Joi.date()
        .iso()
        .messages({
            'date.base': 'Deadline must be a valid date',
            'date.format': 'Deadline must be in a valid date format'
        }),

    location: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .messages({
            'string.empty': 'Location cannot be empty',
            'string.min': 'Location must contain at least 2 characters',
            'string.max': 'Location cannot exceed 100 characters'
        })
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update'
    })


const validateCreateJob = (req, res, next) => {
    const { error, value } = createJobSchema.validate(
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

const validateUpdateJob = (req, res, next) => {
    console.log('UPDATE VALIDATOR BODY:', req.body)

    const { error, value } = updateJobSchema.validate(
        req.body,
        { abortEarly: false }
    )

    if (error) {
        console.log('UPDATE VALIDATOR ERROR:', error.details)

        const errorMessages = error.details.map(
            (detail) => detail.message
        )

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorMessages
        })
    }

    console.log('UPDATE VALIDATOR PASSED:', value)

    req.body = value
    next()
}  

module.exports = {
    validateCreateUser,
    validateLogin,
    validateCreateMessage,
    validateCreateReplyMessage,
    validateCreateJob,
    validateUpdateJob
}