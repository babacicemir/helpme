import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserOffers } from '../../../services/userService'

function MyOffers() {
    const navigate = useNavigate()

    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadOffers = async () => {
            try {
                const response = await getUserOffers()

                setOffers(response.data)
            } catch (error) {
                console.error('USER OFFERS ERROR:', error)

                setError(
                    error.response?.data?.message ||
                    'Failed to load offers'
                )
            } finally {
                setLoading(false)
            }
        }

        loadOffers()
    }, [])

    const getStatusClass = (status) => {
        if (status === 'ACCEPTED') {
            return 'bg-success bg-opacity-10 text-success'
        }

        if (status === 'REJECTED') {
            return 'bg-danger bg-opacity-10 text-danger'
        }

        return 'bg-primary bg-opacity-10 text-primary'
    }

    return (
        <div className="bg-light min-vh-100 py-5">

            <div className="container">

                <div className="mb-5">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">

                        <div>
                            <p className="text-primary fw-semibold mb-2">
                                Your activity
                            </p>

                            <h1 className="fw-bold mb-2">
                                My Offers
                            </h1>

                            <p className="text-muted mb-0">
                                View and manage all offers you have sent.
                            </p>
                        </div>

                        <div className="bg-white rounded-3 shadow-sm px-4 py-3">

                            <div className="d-flex align-items-center gap-3">

                                <div
                                    className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '44px',
                                        height: '44px'
                                    }}
                                >
                                    <i className="bi bi-send fs-5" />
                                </div>

                                <div>
                                    <small className="text-muted d-block">
                                        Total Offers
                                    </small>

                                    <span className="fw-bold fs-5">
                                        {offers.length}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {loading ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div
                                className="spinner-border text-primary mb-3"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p className="text-muted mb-0">
                                Loading offers...
                            </p>

                        </div>

                    </div>

                ) : error ? (

                    <div className="alert alert-danger border-0 shadow-sm">
                        <i className="bi bi-exclamation-circle-fill me-2" />
                        {error}
                    </div>

                ) : offers.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div
                                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{
                                    width: '70px',
                                    height: '70px'
                                }}
                            >
                                <i className="bi bi-send fs-3" />
                            </div>

                            <h4 className="fw-bold mb-2">
                                No Offers Yet
                            </h4>

                            <p className="text-muted mb-0">
                                You have not sent any offers yet.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="row g-4">

                        {offers.map((offer) => (

                            <div
                                className="col-md-6 col-xl-4"
                                key={offer.id}
                            >

                                <div
                                    className="card border-0 shadow-sm h-100"
                                    style={{
                                        borderRadius: '14px'
                                    }}
                                >

                                    <div className="card-body p-4 d-flex flex-column">

                                        <div className="d-flex justify-content-between align-items-start mb-4">

                                            <span
                                                className={`badge px-3 py-2 ${getStatusClass(
                                                    offer.status
                                                )}`}
                                            >
                                                <i className="bi bi-circle-fill me-1 small" />
                                                {offer.status}
                                            </span>

                                            <span className="fw-bold text-primary">
                                                {offer.price} KM
                                            </span>

                                        </div>

                                        <h5 className="fw-bold mb-3">
                                            {offer.job_title}
                                        </h5>

                                        <p
                                            className="text-muted mb-4"
                                            style={{
                                                minHeight: '48px'
                                            }}
                                        >
                                            {offer.job_description}
                                        </p>

                                        <div className="border-top pt-3 mt-auto">

                                            <div className="d-flex justify-content-between mb-2">

                                                <span className="text-muted small">
                                                    <i className="bi bi-clock me-1" />
                                                    Delivery
                                                </span>

                                                <span className="fw-semibold small">
                                                    {offer.delivery_days} days
                                                </span>

                                            </div>

                                            <div className="d-flex justify-content-between mb-4">

                                                <span className="text-muted small">
                                                    <i className="bi bi-calendar-event me-1" />
                                                    Submitted
                                                </span>

                                                <span className="fw-semibold small">
                                                    {new Date(
                                                        offer.created_at
                                                    ).toLocaleDateString()}
                                                </span>

                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-outline-primary w-100"
                                                onClick={() =>
                                                    navigate(
                                                        `/jobs/${offer.job_id}`
                                                    )
                                                }
                                            >
                                                <i className="bi bi-eye me-2" />
                                                View Job
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    )
}

export default MyOffers
