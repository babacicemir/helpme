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

                console.log('MY OFFERS:', response)


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

    return (
        <div>

            <section className="bg-primary text-white py-5">
                <div className="container py-4">

                    <div className="text-center">

                        <h1 className="fw-bold mb-3">
                            My Offers
                        </h1>

                        <p className="lead mb-0">
                            View all offers you have sent
                        </p>

                    </div>

                </div>
            </section>


            <section className="py-5 bg-light">

                <div className="container">

                    {loading ? (

                        <div className="text-center py-5">

                            <p className="text-muted mb-0">
                                Loading offers...
                            </p>

                        </div>

                    ) : error ? (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    ) : offers.length === 0 ? (

                        <div className="text-center py-5">

                            <h5 className="fw-bold mb-2">
                                No offers found
                            </h5>

                            <p className="text-muted mb-0">
                                You have not sent any offers yet.
                            </p>

                        </div>

                    ) : (

                        <div className="row g-4">

                            {offers.map((offer) => (

                                <div
                                    className="col-md-6 col-xl-4"
                                    key={offer.id}
                                >

                                    <div className="card border-0 shadow-sm h-100">

                                        <div className="card-body d-flex flex-column">

                                            <div className="d-flex justify-content-between align-items-start mb-3">

                                                <span className="badge bg-primary">
                                                    {offer.status}
                                                </span>

                                                <span className="fw-semibold">
                                                    {offer.price} KM
                                                </span>

                                            </div>

                                            <h5 className="fw-bold mb-3">
                                                {offer.job_title}
                                            </h5>

                                            <p className="text-muted mb-3">
                                                {offer.job_description}
                                            </p>

                                            <div className="mt-auto">

                                                <div className="d-flex justify-content-between mb-2">

                                                    <span className="text-muted">
                                                        Delivery
                                                    </span>

                                                    <span>
                                                        {offer.delivery_days} days
                                                    </span>

                                                </div>

                                                <button
                                                    className="btn btn-outline-primary w-100 mt-2"
                                                    onClick={() =>
                                                        navigate(`/jobs/${offer.job_id}`)
                                                    }
                                                >
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

            </section>

        </div>
    )
}

export default MyOffers