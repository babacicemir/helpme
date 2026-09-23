import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { login } from '../../services/authService'

function Login() {
    const navigate = useNavigate()
    const { login: setUser } = useAuth()

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
            const response = await login(data)

            console.log('LOGIN RESPONSE:', response)

            const user = response.data

        setUser(user)

        setSuccessMessage(
            'You have successfully logged in! Redirecting...'
        )

        setTimeout(() => {
            if (user.role === 'ADMIN') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        }, 1500)

    } catch (error) {
        console.error('LOGIN ERROR:', error)

        setServerErrors(
            error.response?.data?.errors || [
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Something went wrong'
            ]
        )
    }
}

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">
                                Login
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
                                <div className="mb-3">
                                    <label className="form-label">
                                        Username or Email
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
                                                'Username or email is required'
                                        })}
                                    />

                                    {errors.username && (
                                        <div className="invalid-feedback">
                                            {errors.username.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
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
                                                'Password is required'
                                        })}
                                    />

                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password.message}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? 'Logging in...'
                                        : 'Login'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login