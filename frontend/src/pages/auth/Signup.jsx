import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { signup } from '../../services/authService'

function Signup() {
    const navigate = useNavigate()
    const [serverErrors, setServerErrors] = useState([])
    const [successMessage, setSuccessMessage] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm()

    const onSubmit = async (data) => {
        setServerErrors([])
        setSuccessMessage('')

        try {
            const response = await signup(data)

            console.log('SIGNUP RESPONSE:', response)

            setSuccessMessage(
                'Your account has been successfully created! Redirecting to login...'
            )

            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (error) {
            console.error('SIGNUP ERROR:', error)

            setServerErrors(
                error.response?.data?.errors || [
                    error.response?.data?.message ||
                    'Something went wrong'
                ]
            )
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">
                                Create Account
                            </h2>

                            {successMessage && (
                                <div className="alert alert-success">
                                    {successMessage}
                                </div>
                            )}

                            {serverErrors.length > 0 && (
                                <div className="alert alert-danger">
                                    <ul className="mb-0">
                                        {serverErrors.map(
                                            (message, index) => (
                                                <li key={index}>
                                                    {message}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.firstName
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            {...register('firstName', {
                                                required:
                                                    'First name is required',
                                                minLength: {
                                                    value: 2,
                                                    message:
                                                        'First name must have at least 2 characters'
                                                },
                                                maxLength: {
                                                    value: 50,
                                                    message:
                                                        'First name cannot exceed 50 characters'
                                                }
                                            })}
                                        />

                                        {errors.firstName && (
                                            <div className="invalid-feedback">
                                                {errors.firstName.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            className={`form-control ${
                                                errors.lastName
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            {...register('lastName', {
                                                required:
                                                    'Last name is required',
                                                minLength: {
                                                    value: 2,
                                                    message:
                                                        'Last name must have at least 2 characters'
                                                },
                                                maxLength: {
                                                    value: 50,
                                                    message:
                                                        'Last name cannot exceed 50 characters'
                                                }
                                            })}
                                        />

                                        {errors.lastName && (
                                            <div className="invalid-feedback">
                                                {errors.lastName.message}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        className={`form-control ${
                                            errors.username
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        {...register('username', {
                                            required:
                                                'Username is required',
                                            minLength: {
                                                value: 3,
                                                message:
                                                    'Username must have at least 3 characters'
                                            },
                                            maxLength: {
                                                value: 50,
                                                message:
                                                    'Username cannot exceed 50 characters'
                                            },
                                            pattern: {
                                                value: /^[a-zA-Z0-9]+$/,
                                                message:
                                                    'Username can only contain letters and numbers'
                                            }
                                        })}
                                    />

                                    {errors.username && (
                                        <div className="invalid-feedback">
                                            {errors.username.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className={`form-control ${
                                            errors.email
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        {...register('email', {
                                            required:
                                                'Email is required',
                                            pattern: {
                                                value:
                                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message:
                                                    'Please enter a valid email address'
                                            }
                                        })}
                                    />

                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className={`form-control ${
                                            errors.password
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        {...register('password', {
                                            required:
                                                'Password is required',
                                            minLength: {
                                                value: 8,
                                                message:
                                                    'Password must have at least 8 characters'
                                            },
                                            maxLength: {
                                                value: 50,
                                                message:
                                                    'Password cannot exceed 50 characters'
                                            },
                                            pattern: {
                                                value:
                                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                                                message:
                                                    'Password must contain an uppercase letter, lowercase letter, number and special character'
                                            }
                                        })}
                                    />

                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password.message}
                                        </div>
                                    )}

                                    <div className="form-text">
                                        Password must contain at least 8
                                        characters, one uppercase letter,
                                        one lowercase letter, one number
                                        and one special character.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        className={`form-control ${
                                            errors.location
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        placeholder="e.g. Sarajevo"
                                        {...register('location', {
                                            required:
                                                'Location is required',
                                            minLength: {
                                                value: 2,
                                                message:
                                                    'Location must have at least 2 characters'
                                            },
                                            maxLength: {
                                                value: 100,
                                                message:
                                                    'Location cannot exceed 100 characters'
                                            }
                                        })}
                                    />

                                    {errors.location && (
                                        <div className="invalid-feedback">
                                            {errors.location.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Bio
                                    </label>

                                    <textarea
                                        className={`form-control ${
                                            errors.bio
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        rows="3"
                                        placeholder="Tell us something about yourself..."
                                        {...register('bio', {
                                            maxLength: {
                                                value: 500,
                                                message:
                                                    'Bio cannot exceed 500 characters'
                                            }
                                        })}
                                    />

                                    {errors.bio && (
                                        <div className="invalid-feedback">
                                            {errors.bio.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        Profile Image URL
                                    </label>

                                    <input
                                        type="url"
                                        className={`form-control ${
                                            errors.profileImg
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        placeholder="https://..."
                                        {...register('profileImg', {
                                            validate: (value) => {
                                                if (!value) {
                                                    return true
                                                }

                                                try {
                                                    new URL(value)
                                                    return true
                                                } catch {
                                                    return 'Profile image must be a valid URL'
                                                }
                                            }
                                        })}
                                    />

                                    {errors.profileImg && (
                                        <div className="invalid-feedback">
                                            {errors.profileImg.message}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? 'Creating account...'
                                        : 'Create Account'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup