import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import NotificationsModal from '../../pages/notifications/NotificationsModal'

function Navbar() {
    const { user, logout } = useAuth()
    const [showNotifications, setShowNotifications] = useState(false)

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-white border-bottom">
                <div className="container">
                    <Link
                        className="navbar-brand fw-bold"
                        to="/"
                    >
                        HelpMe.ba
                    </Link>

                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            user.role === 'ADMIN' ? (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-link nav-link p-0"
                                    >
                                        <i className="bi bi-person-circle fs-5" />
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        className="nav-link"
                                        to="/my-jobs"
                                    >
                                        My Jobs
                                    </Link>

                                    <Link
                                        className="nav-link"
                                        to="/offers"
                                    >
                                        My Offers
                                    </Link>

                                    <button
                                        type="button"
                                        className="btn btn-link nav-link position-relative p-0"
                                        onClick={() =>
                                            setShowNotifications(true)
                                        }
                                        aria-label="Notifications"
                                    >
                                        <i className="bi bi-bell fs-5" />
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-link nav-link p-0"
                                        aria-label="Profile"
                                    >
                                        <i className="bi bi-person-circle fs-5" />
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </>
                            )
                        ) : (
                            <>
                                <Link
                                    className="btn btn-outline-primary"
                                    to="/login"
                                >
                                    Login
                                </Link>

                                <Link
                                    className="btn btn-primary"
                                    to="/signup"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {showNotifications && (
                <NotificationsModal
                    onClose={() => setShowNotifications(false)}
                />
            )}
        </>
    )
}

export default Navbar
