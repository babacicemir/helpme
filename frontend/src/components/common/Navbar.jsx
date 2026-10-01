import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import NotificationsModal from '../../pages/notifications/NotificationsModal'

function Navbar() {
const { user, logout } = useAuth()
const [showNotifications, setShowNotifications] = useState(false)

return (
    <>
        <nav className="navbar navbar-expand-lg bg-white">
            <div className="container py-2">

                <Link
                    className="navbar-brand fw-bold text-primary fs-4"
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
                                    className="btn btn-link text-dark p-0"
                                    aria-label="Profile"
                                >
                                    <i className="bi bi-person-circle fs-4" />
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger px-3"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    className="nav-link fw-medium"
                                    to="/my-jobs"
                                >
                                    My Jobs
                                </Link>

                                <Link
                                    className="nav-link fw-medium"
                                    to="/my-offers"
                                >
                                    My Offers
                                </Link>

                                <button
                                    type="button"
                                    className="btn btn-link text-dark p-0 position-relative"
                                    onClick={() =>
                                        setShowNotifications(true)
                                    }
                                    aria-label="Notifications"
                                >
                                    <i className="bi bi-bell fs-5" />
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-link text-dark p-0"
                                    aria-label="Profile"
                                >
                                    <i className="bi bi-person-circle fs-5" />
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger px-3"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </>
                        )
                    ) : (
                        <>
                            <Link
                                className="btn btn-outline-primary px-3"
                                to="/login"
                            >
                                Login
                            </Link>

                            <Link
                                className="btn btn-primary px-3"
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

