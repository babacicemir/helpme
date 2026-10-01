import { useEffect, useState } from 'react'
import {
    getOffersByJob,
    acceptOffer,
    rejectOffer
} from '../../../services/userService'
import AcceptOfferModal from './AcceptOfferModal'
import RejectOfferModal from './RejectOfferModal'

function OffersModal({ job, onClose }) {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [processingOfferId, setProcessingOfferId] = useState(null)

    const [showAcceptModal, setShowAcceptModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [selectedOffer, setSelectedOffer] = useState(null)

    const mockRating = 4.8
    const mockReviews = 24

    useEffect(() => {
        const loadOffers = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await getOffersByJob(job.id)

                setOffers(response.data || [])
            } catch (error) {
                console.error('Error loading offers:', error)

                setError(
                    error.response?.data?.message ||
                    'Failed to load offers.'
                )
            } finally {
                setLoading(false)
            }
        }

        if (job?.id) {
            loadOffers()
        }
    }, [job])

    const openAcceptModal = (offer) => {
        setSelectedOffer(offer)
        setShowAcceptModal(true)
    }

    const closeAcceptModal = () => {
        setShowAcceptModal(false)
        setSelectedOffer(null)
    }

    const openRejectModal = (offer) => {
        setSelectedOffer(offer)
        setShowRejectModal(true)
    }

    const closeRejectModal = () => {
        setShowRejectModal(false)
        setSelectedOffer(null)
    }

    const handleAcceptOffer = async () => {
        if (!selectedOffer) {
            return
        }

        try {
            setProcessingOfferId(selectedOffer.id)
            setError('')

            const response = await acceptOffer(selectedOffer.id)

            const updatedOffer = response.data

            setOffers((currentOffers) =>
                currentOffers.map((offer) =>
                    offer.id === updatedOffer.id
                        ? {
                              ...offer,
                              ...updatedOffer
                          }
                        : offer
                )
            )

            closeAcceptModal()
        } catch (error) {
            console.error('Error accepting offer:', error)

            setError(
                error.response?.data?.message ||
                'Failed to accept offer.'
            )
        } finally {
            setProcessingOfferId(null)
        }
    }

    const handleRejectOffer = async () => {
        if (!selectedOffer) {
            return
        }

        try {
            setProcessingOfferId(selectedOffer.id)
            setError('')

            const response = await rejectOffer(selectedOffer.id)

            const updatedOffer = response.data

            setOffers((currentOffers) =>
                currentOffers.map((offer) =>
                    offer.id === updatedOffer.id
                        ? {
                              ...offer,
                              ...updatedOffer
                          }
                        : offer
                )
            )

            closeRejectModal()
        } catch (error) {
            console.error('Error rejecting offer:', error)

            setError(
                error.response?.data?.message ||
                'Failed to reject offer.'
            )
        } finally {
            setProcessingOfferId(null)
        }
    }

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
        <>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                style={{
                    zIndex: 1050,
                    backgroundColor: 'rgba(0, 0, 0, 0.55)'
                }}
            >

                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">

                    <div className="modal-content border-0 shadow-lg">

                        <div className="modal-header px-4 py-3">

                            <div className="d-flex align-items-center">

                                <div
                                    className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '46px',
                                        height: '46px'
                                    }}
                                >
                                    <i className="bi bi-chat-square-text fs-5" />
                                </div>

                                <div>

                                    <h5 className="modal-title fw-bold mb-1">
                                        Offers
                                    </h5>

                                    <small className="text-muted">
                                        {job.title}
                                    </small>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            />

                        </div>

                        <div className="modal-body px-4 py-4">

                            {loading ? (

                                <div className="text-center py-5">

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

                            ) : error ? (

                                <div className="alert alert-danger border-0">
                                    <i className="bi bi-exclamation-circle-fill me-2" />
                                    {error}
                                </div>

                            ) : (

                                <>

                                    <div className="d-flex justify-content-between align-items-center mb-4">

                                        <div>

                                            <h6 className="fw-bold mb-1">
                                                Received Offers
                                            </h6>

                                            <small className="text-muted">
                                                Review the offers submitted
                                                for this job.
                                            </small>

                                        </div>

                                        <span className="badge bg-primary px-3 py-2">
                                            {offers.length}{' '}
                                            {offers.length === 1
                                                ? 'offer'
                                                : 'offers'}
                                        </span>

                                    </div>

                                    {offers.length === 0 ? (

                                        <div className="bg-light rounded-3 text-center py-5">

                                            <div
                                                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                                style={{
                                                    width: '65px',
                                                    height: '65px'
                                                }}
                                            >
                                                <i className="bi bi-inbox fs-3" />
                                            </div>

                                            <h5 className="fw-bold">
                                                No Offers Yet
                                            </h5>

                                            <p className="text-muted mb-0">
                                                You haven't received any offers
                                                for this job yet.
                                            </p>

                                        </div>

                                    ) : (

                                        <div className="d-flex flex-column gap-3">

                                            {offers.map((offer) => (

                                                <div
                                                    key={offer.id}
                                                    className="border rounded-3 p-4"
                                                >

                                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">

                                                        <div className="d-flex align-items-start">

                                                            <div
                                                                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                                style={{
                                                                    width: '46px',
                                                                    height: '46px'
                                                                }}
                                                            >
                                                                <i className="bi bi-person fs-5" />
                                                            </div>

                                                            <div>

                                                                <h6 className="fw-bold mb-1">
                                                                    {
                                                                        offer.first_name
                                                                    }{' '}
                                                                    {
                                                                        offer.last_name
                                                                    }
                                                                </h6>

                                                                <small className="text-muted">
                                                                    @
                                                                    {
                                                                        offer.username
                                                                    }
                                                                </small>

                                                                <div className="mt-2">

                                                                    <span className="small text-warning">
                                                                        <i className="bi bi-star-fill me-1" />
                                                                        {mockRating}
                                                                    </span>

                                                                    <span className="text-muted small ms-1">
                                                                        ({mockReviews}{' '}
                                                                        reviews)
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </div>

                                                        <div className="text-md-end">

                                                            <h5 className="fw-bold text-primary mb-1">
                                                                {offer.price} KM
                                                            </h5>

                                                            <small className="text-muted">
                                                                <i className="bi bi-clock me-1" />
                                                                {
                                                                    offer.delivery_days
                                                                }{' '}
                                                                days
                                                            </small>

                                                        </div>

                                                    </div>

                                                    <div className="bg-light rounded-3 p-3 mb-4">

                                                        <small className="text-muted d-block mb-1">
                                                            <i className="bi bi-chat-left-text text-primary me-1" />
                                                            Offer Message
                                                        </small>

                                                        <p className="mb-0">
                                                            {offer.message ||
                                                                'No message provided.'}
                                                        </p>

                                                    </div>

                                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                                                        <small className="text-muted">

                                                            <i className="bi bi-calendar-event me-1" />

                                                            Submitted:{' '}
                                                            {new Date(
                                                                offer.created_at
                                                            ).toLocaleDateString()}

                                                        </small>

                                                        <div className="d-flex flex-wrap gap-2">

                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary btn-sm"
                                                            >
                                                                <i className="bi bi-person me-1" />
                                                                View Profile
                                                            </button>

                                                            {offer.status ===
                                                                'PENDING' && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-success btn-sm"
                                                                        onClick={() =>
                                                                            openAcceptModal(
                                                                                offer
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processingOfferId ===
                                                                            offer.id
                                                                        }
                                                                    >
                                                                        <i className="bi bi-check-lg me-1" />
                                                                        Accept
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger btn-sm"
                                                                        onClick={() =>
                                                                            openRejectModal(
                                                                                offer
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processingOfferId ===
                                                                            offer.id
                                                                        }
                                                                    >
                                                                        <i className="bi bi-x-lg me-1" />
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}

                                                            {offer.status ===
                                                                'ACCEPTED' && (
                                                                <span
                                                                    className={`badge px-3 py-2 d-flex align-items-center ${getStatusClass(
                                                                        offer.status
                                                                    )}`}
                                                                >
                                                                    <i className="bi bi-check-circle-fill me-1" />
                                                                    Accepted
                                                                </span>
                                                            )}

                                                            {offer.status ===
                                                                'REJECTED' && (
                                                                <span
                                                                    className={`badge px-3 py-2 d-flex align-items-center ${getStatusClass(
                                                                        offer.status
                                                                    )}`}
                                                                >
                                                                    <i className="bi bi-x-circle-fill me-1" />
                                                                    Rejected
                                                                </span>
                                                            )}

                                                        </div>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    )}

                                </>

                            )}

                        </div>

                        <div className="modal-footer px-4 py-3">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1040 }}
                onClick={onClose}
            />

            {showAcceptModal && (
                <AcceptOfferModal
                    offer={selectedOffer}
                    onConfirm={handleAcceptOffer}
                    onClose={closeAcceptModal}
                    loading={
                        processingOfferId === selectedOffer?.id
                    }
                />
            )}

            {showRejectModal && (
                <RejectOfferModal
                    offer={selectedOffer}
                    onConfirm={handleRejectOffer}
                    onClose={closeRejectModal}
                    loading={
                        processingOfferId === selectedOffer?.id
                    }
                />
            )}
        </>
    )
}

export default OffersModal
