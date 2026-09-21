import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    HelpMe.ba
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/jobs">
                                Jobs
                            </Link>
                        </li>
                    </ul>

                    <div className="d-flex gap-2">
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
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar