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

    return (
        <>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                style={{ zIndex: 1050 }}
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div>
                                <h5 className="modal-title fw-bold mb-1">
                                    Offers
                                </h5>

                                <small className="text-muted">
                                    {job.title}
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            />
                        </div>

                        <div className="modal-body">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div
                                        className="spinner-border text-primary"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>

                                    <p className="text-muted mt-3 mb-0">
                                        Loading offers...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger mb-0">
                                    {error}
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h6 className="fw-bold mb-0">
                                            {offers.length} offers received
                                        </h6>
                                    </div>

                                    {offers.length === 0 ? (
                                        <div className="text-center py-5">
                                            <h5 className="fw-bold">
                                                No offers yet
                                            </h5>

                                            <p className="text-muted mb-0">
                                                You haven't received any
                                                offers for this job yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {offers.map((offer) => (
                                                <div
                                                    key={offer.id}
                                                    className="border rounded p-3"
                                                >
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
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

                                                            <div className="mt-1">
                                                                <small>
                                                                    ⭐{' '}
                                                                    {
                                                                        mockRating
                                                                    }{' '}
                                                                    (
                                                                    {
                                                                        mockReviews
                                                                    }{' '}
                                                                    reviews)
                                                                </small>
                                                            </div>
                                                        </div>

                                                        <div className="text-end">
                                                            <h5 className="fw-bold mb-1">
                                                                {offer.price} KM
                                                            </h5>

                                                            <small className="text-muted">
                                                                {
                                                                    offer.delivery_days
                                                                }{' '}
                                                                days
                                                            </small>
                                                        </div>
                                                    </div>

                                                    <p className="text-muted mb-3">
                                                        {offer.message}
                                                    </p>

                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <small className="text-muted">
                                                            Submitted:{' '}
                                                            {new Date(
                                                                offer.created_at
                                                            ).toLocaleDateString()}
                                                        </small>

                                                        <div className="d-flex gap-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary btn-sm"
                                                            >
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
                                                                        Accept
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm"
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
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}

                                                            {offer.status ===
                                                                'ACCEPTED' && (
                                                                <span className="badge bg-success d-flex align-items-center">
                                                                    Accepted
                                                                </span>
                                                            )}

                                                            {offer.status ===
                                                                'REJECTED' && (
                                                                <span className="badge bg-danger d-flex align-items-center">
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

                        <div className="modal-footer">
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