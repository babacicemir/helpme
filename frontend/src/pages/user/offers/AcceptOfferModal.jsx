function AcceptOfferModal({ offer, onConfirm, onClose }) {
    if (!offer) {
        return null
    }

    return (
        <>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                style={{ zIndex: 1060 }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold">
                                Accept Offer
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            />
                        </div>

                        <div className="modal-body">
                            <p className="mb-2">
                                Are you sure you want to accept this offer?
                            </p>

                            <p className="text-muted mb-0">
                                Offer from{' '}
                                <strong>
                                    {offer.firstName} {offer.lastName}
                                </strong>{' '}
                                for <strong>{offer.price} KM</strong>.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={onConfirm}
                            >
                                Accept Offer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1055 }}
            />
        </>
    )
}

export default AcceptOfferModal