import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

function Navbar() {
    const { user, logout } = useAuth()

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom">
            <div className="container">
                <Link
                    className="navbar-brand fw-bold"
                    to="/"
                >
                    HelpMe.ba
                </Link>

                <div className="d-flex align-items-center gap-2">
                    <Link
                        className="nav-link"
                        to="/"
                    >
                        Home
                    </Link>

                    {user ? (
                        <>
                            <Link
                                className="nav-link"
                                to="/jobs"
                            >
                                Jobs
                            </Link>

                            <Link
                                className="nav-link"
                                to="/offers"
                            >
                                My Offers
                            </Link>

                            <span className="ms-2">
                                Pozdrav, {user.username}
                            </span>

                            <button
                                className="btn btn-outline-danger"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </>
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
    )
}

export default Navbar