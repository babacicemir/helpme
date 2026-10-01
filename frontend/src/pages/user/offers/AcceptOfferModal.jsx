function AcceptOfferModal({
    offer,
    onConfirm,
    onClose,
    loading
}) {
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
                style={{
                    zIndex: 1060,
                    backgroundColor: 'rgba(0, 0, 0, 0.25)'
                }}
            >

                <div className="modal-dialog modal-dialog-centered">

                    <div className="modal-content border-0 shadow-lg">

                        <div className="modal-header px-4 py-3">

                            <div className="d-flex align-items-center">

                                <div
                                    className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '46px',
                                        height: '46px'
                                    }}
                                >
                                    <i className="bi bi-check-lg fs-5" />
                                </div>

                                <div>

                                    <h5 className="modal-title fw-bold mb-1">
                                        Accept Offer
                                    </h5>

                                    <small className="text-muted">
                                        Confirm your decision
                                    </small>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                disabled={loading}
                                aria-label="Close"
                            />

                        </div>

                        <div className="modal-body px-4 py-4">

                            <p className="mb-3">
                                Are you sure you want to accept this offer?
                            </p>

                            <div className="bg-light rounded-3 p-3">

                                <div className="d-flex align-items-center mb-3">

                                    <div
                                        className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{
                                            width: '42px',
                                            height: '42px'
                                        }}
                                    >
                                        <i className="bi bi-person" />
                                    </div>

                                    <div>

                                        <small className="text-muted d-block">
                                            Offer from
                                        </small>

                                        <strong>
                                            {offer.firstName ||
                                                offer.first_name}{' '}
                                            {offer.lastName ||
                                                offer.last_name}
                                        </strong>

                                    </div>

                                </div>

                                <div className="d-flex justify-content-between align-items-center">

                                    <span className="text-muted">
                                        Offer price
                                    </span>

                                    <strong className="text-success">
                                        {offer.price} KM
                                    </strong>

                                </div>

                            </div>

                        </div>

                        <div className="modal-footer px-4 py-3">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                <i className="bi bi-check-lg me-1" />

                                {loading
                                    ? 'Accepting...'
                                    : 'Accept Offer'}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <div
                className="modal-backdrop fade show"
                style={{
                    zIndex: 1055
                }}
            />
        </>
    )
}

export default AcceptOfferModal
