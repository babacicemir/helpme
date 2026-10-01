import { useEffect, useState } from 'react'
import {
    getLatestJobs,
    getMessagesByJob,
    createMessage,
    createReplyMessage,
    sendOffer
} from '../../../services/userService'

function Jobs() {
    const [jobs, setJobs] = useState([])
    const [loadingJobs, setLoadingJobs] = useState(true)
    const [jobsError, setJobsError] = useState('')

    const [selectedJob, setSelectedJob] = useState(null)
    const [activeSection, setActiveSection] = useState(null)

    const [messages, setMessages] = useState([])
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [messagesError, setMessagesError] = useState('')

    const [message, setMessage] = useState('')
    const [replyToMessageId, setReplyToMessageId] = useState(null)
    const [replyMessage, setReplyMessage] = useState('')

    const [offerPrice, setOfferPrice] = useState('')
    const [deliveryDays, setDeliveryDays] = useState('')
    const [offerMessage, setOfferMessage] = useState('')

    const [sendingMessage, setSendingMessage] = useState(false)
    const [sendingReply, setSendingReply] = useState(false)
    const [sendingOffer, setSendingOffer] = useState(false)

    const [messageError, setMessageError] = useState('')
    const [replyError, setReplyError] = useState('')
    const [offerError, setOfferError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const response = await getLatestJobs()
                setJobs(response.data)
            } catch (error) {
                console.error('JOBS ERROR:', error)
                setJobsError('Failed to load jobs')
            } finally {
                setLoadingJobs(false)
            }
        }

        loadJobs()
    }, [])

    const getTimeAgo = (date) => {
        const now = new Date()
        const createdAt = new Date(date)

        const diffInSeconds = Math.floor(
            (now - createdAt) / 1000
        )

        if (diffInSeconds < 60) {
            return 'just now'
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60)

        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${
                diffInMinutes === 1 ? 'minute' : 'minutes'
            } ago`
        }

        const diffInHours = Math.floor(diffInMinutes / 60)

        if (diffInHours < 24) {
            return `${diffInHours} ${
                diffInHours === 1 ? 'hour' : 'hours'
            } ago`
        }

        const diffInDays = Math.floor(diffInHours / 24)

        if (diffInDays < 30) {
            return `${diffInDays} ${
                diffInDays === 1 ? 'day' : 'days'
            } ago`
        }

        const diffInMonths = Math.floor(diffInDays / 30)

        return `${diffInMonths} ${
            diffInMonths === 1 ? 'month' : 'months'
        } ago`
    }

    const loadMessages = async (jobId) => {
        try {
            setLoadingMessages(true)
            setMessagesError('')

            const response = await getMessagesByJob(jobId)

            setMessages(response.data)
        } catch (error) {
            console.error('MESSAGES ERROR:', error)
            setMessagesError('Failed to load messages')
        } finally {
            setLoadingMessages(false)
        }
    }

    const openJobModal = (job) => {
        setSelectedJob(job)
        setActiveSection(null)
        setMessages([])
        setMessagesError('')
        setMessage('')
        setReplyToMessageId(null)
        setReplyMessage('')
        setOfferPrice('')
        setDeliveryDays('')
        setOfferMessage('')
        setMessageError('')
        setReplyError('')
        setOfferError('')
        setSuccessMessage('')
    }

    const closeJobModal = () => {
        setSelectedJob(null)
        setActiveSection(null)
        setMessages([])
        setMessagesError('')
        setMessage('')
        setReplyToMessageId(null)
        setReplyMessage('')
        setOfferPrice('')
        setDeliveryDays('')
        setOfferMessage('')
        setMessageError('')
        setReplyError('')
        setOfferError('')
        setSuccessMessage('')
    }

    const handleSectionToggle = (section) => {
        if (activeSection === section) {
            setActiveSection(null)
            return
        }

        setActiveSection(section)
        setSuccessMessage('')
        setMessageError('')
        setReplyError('')
        setOfferError('')

        if (section === 'messages') {
            setReplyToMessageId(null)
            setReplyMessage('')
            loadMessages(selectedJob.id)
        }
    }

    const handleSendMessage = async (event) => {
        event.preventDefault()

        if (!message.trim()) {
            return
        }

        try {
            setSendingMessage(true)
            setMessageError('')
            setSuccessMessage('')

            await createMessage(
                selectedJob.id,
                message.trim()
            )

            setMessage('')
            await loadMessages(selectedJob.id)

            setSuccessMessage('Message sent successfully')
        } catch (error) {
            console.error('SEND MESSAGE ERROR:', error)

            setMessageError(
                error.response?.data?.message ||
                'Failed to send message'
            )
        } finally {
            setSendingMessage(false)
        }
    }

    const handleReplyToggle = (messageId) => {
        if (replyToMessageId === messageId) {
            setReplyToMessageId(null)
            setReplyMessage('')
            setReplyError('')
            return
        }

        setReplyToMessageId(messageId)
        setReplyMessage('')
        setReplyError('')
        setSuccessMessage('')
    }

    const handleSendReply = async (event, messageId) => {
        event.preventDefault()

        if (!replyMessage.trim()) {
            return
        }

        try {
            setSendingReply(true)
            setReplyError('')
            setSuccessMessage('')

            await createReplyMessage(
                messageId,
                replyMessage.trim()
            )

            setReplyMessage('')
            setReplyToMessageId(null)

            await loadMessages(selectedJob.id)

            setSuccessMessage('Reply sent successfully')
        } catch (error) {
            console.error('SEND REPLY ERROR:', error)

            setReplyError(
                error.response?.data?.message ||
                'Failed to send reply'
            )
        } finally {
            setSendingReply(false)
        }
    }

    const handleSendOffer = async (event) => {
        event.preventDefault()

        if (!offerPrice || !deliveryDays) {
            return
        }

        try {
            setSendingOffer(true)
            setOfferError('')
            setSuccessMessage('')

            await sendOffer(
                selectedJob.id,
                offerPrice,
                deliveryDays,
                offerMessage.trim()
            )

            setOfferPrice('')
            setDeliveryDays('')
            setOfferMessage('')
            setActiveSection(null)

            setSuccessMessage('Offer sent successfully')
        } catch (error) {
            console.error('SEND OFFER ERROR:', error)

            setOfferError(
                error.response?.data?.message ||
                'Failed to send offer'
            )
        } finally {
            setSendingOffer(false)
        }
    }

    const mainMessages = messages.filter(
        (item) => item.parent_message_id === null
    )

    const getReplies = (messageId) => {
        return messages.filter(
            (item) => item.parent_message_id === messageId
        )
    }

    return (
        <div className="bg-light min-vh-100 py-5">

            <div className="container">

                <div className="mb-5">

                    <p className="text-primary fw-semibold mb-2">
                        Explore opportunities
                    </p>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">

                        <div>
                            <h1 className="fw-bold mb-2">
                                Find Jobs
                            </h1>

                            <p className="text-muted mb-0">
                                Browse jobs posted by the HelpMe.ba community
                            </p>
                        </div>

                        <div className="bg-white shadow-sm rounded-3 px-4 py-3">
                            <div className="d-flex align-items-center gap-3">

                                <div
                                    className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '46px',
                                        height: '46px'
                                    }}
                                >
                                    <i className="bi bi-briefcase fs-5" />
                                </div>

                                <div>
                                    <small className="text-muted d-block">
                                        Available Jobs
                                    </small>

                                    <span className="fw-bold fs-5">
                                        {jobs.length}
                                    </span>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

                {loadingJobs ? (

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
                                Loading jobs...
                            </p>

                        </div>
                    </div>

                ) : jobsError ? (

                    <div className="alert alert-danger border-0 shadow-sm">
                        <i className="bi bi-exclamation-circle-fill me-2" />
                        {jobsError}
                    </div>

                ) : jobs.length === 0 ? (

                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">

                            <div
                                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{
                                    width: '68px',
                                    height: '68px'
                                }}
                            >
                                <i className="bi bi-briefcase fs-3" />
                            </div>

                            <h5 className="fw-bold">
                                No Jobs Available
                            </h5>

                            <p className="text-muted mb-0">
                                There are currently no open jobs.
                            </p>

                        </div>
                    </div>

                ) : (

                    <div className="row g-4">

                        {jobs.map((job) => (

                            <div
                                className="col-md-6 col-xl-4"
                                key={job.id}
                            >

                                <div
                                    className="card border-0 shadow-sm h-100"
                                    style={{
                                        borderRadius: '14px'
                                    }}
                                >

                                    <div className="card-body p-4 d-flex flex-column">

                                        <div className="d-flex justify-content-between align-items-start mb-4">

                                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                                <i className="bi bi-tag me-1" />
                                                {job.category}
                                            </span>

                                            <small className="text-muted">
                                                <i className="bi bi-clock me-1" />
                                                {getTimeAgo(job.created_at)}
                                            </small>

                                        </div>

                                        <h5 className="fw-bold mb-3">
                                            {job.title}
                                        </h5>

                                        <p
                                            className="text-muted mb-4"
                                            style={{
                                                minHeight: '48px'
                                            }}
                                        >
                                            {job.description}
                                        </p>

                                        <div className="mt-auto">

                                            <div className="border-top pt-3">

                                                <div className="d-flex justify-content-between mb-2">

                                                    <span className="text-muted small">
                                                        <i className="bi bi-person me-1" />
                                                        Posted by
                                                    </span>

                                                    <span className="fw-medium small">
                                                        {job.username}
                                                    </span>

                                                </div>

                                                <div className="d-flex justify-content-between mb-2">

                                                    <span className="text-muted small">
                                                        <i className="bi bi-geo-alt me-1" />
                                                        Location
                                                    </span>

                                                    <span className="fw-medium small">
                                                        {job.location ||
                                                            'Not specified'}
                                                    </span>

                                                </div>

                                                <div className="d-flex justify-content-between align-items-center mb-4">

                                                    <span className="text-muted small">
                                                        <i className="bi bi-cash me-1" />
                                                        Budget
                                                    </span>

                                                    <span className="fw-bold text-primary">
                                                        {job.budget} KM
                                                    </span>

                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary w-100"
                                                    onClick={() =>
                                                        openJobModal(job)
                                                    }
                                                >
                                                    <i className="bi bi-eye me-2" />
                                                    View Job
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {selectedJob && (

                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                        style={{
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
                                            <i className="bi bi-briefcase fs-5" />
                                        </div>

                                        <div>

                                            <h5 className="modal-title fw-bold mb-1">
                                                {selectedJob.title}
                                            </h5>

                                            <small className="text-muted">
                                                Posted by {selectedJob.username}
                                            </small>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closeJobModal}
                                        aria-label="Close"
                                    />

                                </div>

                                <div className="modal-body px-4 py-4">

                                    <div className="d-flex flex-wrap gap-2 mb-4">

                                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                            <i className="bi bi-tag me-1" />
                                            {selectedJob.category}
                                        </span>

                                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                                            <i className="bi bi-check-circle me-1" />
                                            {selectedJob.status}
                                        </span>

                                    </div>

                                    <div className="bg-light rounded-3 p-4 mb-4">

                                        <div className="d-flex align-items-center mb-2">

                                            <i className="bi bi-card-text text-primary me-2" />

                                            <h6 className="fw-bold mb-0">
                                                Job Description
                                            </h6>

                                        </div>

                                        <p className="text-muted mb-0">
                                            {selectedJob.description}
                                        </p>

                                    </div>

                                    <div className="row g-3 mb-4">

                                        <div className="col-md-4">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-2">
                                                    <i className="bi bi-cash text-primary me-1" />
                                                    Budget
                                                </small>

                                                <span className="fw-bold text-primary">
                                                    {selectedJob.budget} KM
                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-4">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-2">
                                                    <i className="bi bi-geo-alt text-primary me-1" />
                                                    Location
                                                </small>

                                                <span className="fw-semibold">
                                                    {selectedJob.location ||
                                                        'Not specified'}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-4">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-2">
                                                    <i className="bi bi-calendar-event text-primary me-1" />
                                                    Deadline
                                                </small>

                                                <span className="fw-semibold">
                                                    {selectedJob.deadline
                                                        ? new Date(
                                                            selectedJob.deadline
                                                        ).toLocaleDateString()
                                                        : 'Not specified'}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="row g-3">

                                        <div className="col-md-6">

                                            <div className="border rounded-3 p-3">

                                                <small className="text-muted d-block mb-1">
                                                    Posted by
                                                </small>

                                                <span className="fw-semibold">
                                                    <i className="bi bi-person text-primary me-2" />
                                                    {selectedJob.username}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="border rounded-3 p-3">

                                                <small className="text-muted d-block mb-1">
                                                    Posted
                                                </small>

                                                <span className="fw-semibold">
                                                    <i className="bi bi-clock text-primary me-2" />
                                                    {getTimeAgo(
                                                        selectedJob.created_at
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <hr className="my-4" />

                                    {successMessage && (
                                        <div className="alert alert-success border-0 shadow-sm">
                                            <i className="bi bi-check-circle-fill me-2" />
                                            {successMessage}
                                        </div>
                                    )}

                                    {activeSection === 'messages' && (

                                        <div className="bg-light rounded-3 p-4 mb-4">

                                            <div className="d-flex justify-content-between align-items-center mb-4">

                                                <div>
                                                    <h6 className="fw-bold mb-1">
                                                        <i className="bi bi-chat-dots text-primary me-2" />
                                                        Messages
                                                    </h6>

                                                    <small className="text-muted">
                                                        Discussion about this job
                                                    </small>
                                                </div>

                                                <span className="badge bg-primary">
                                                    Discussion
                                                </span>

                                            </div>

                                            {loadingMessages ? (

                                                <div className="text-center py-4">

                                                    <div
                                                        className="spinner-border spinner-border-sm text-primary mb-2"
                                                        role="status"
                                                    />

                                                    <p className="text-muted small mb-0">
                                                        Loading messages...
                                                    </p>

                                                </div>

                                            ) : messagesError ? (

                                                <div className="alert alert-danger border-0">
                                                    {messagesError}
                                                </div>

                                            ) : mainMessages.length === 0 ? (

                                                <div className="bg-white rounded-3 p-4 text-center mb-3">

                                                    <i className="bi bi-chat text-muted fs-3 d-block mb-2" />

                                                    <p className="text-muted mb-0">
                                                        No messages yet. Start a discussion about this job.
                                                    </p>

                                                </div>

                                            ) : (

                                                <div className="mb-3">

                                                    {mainMessages.map(
                                                        (mainMessage) => (

                                                            <div
                                                                key={mainMessage.id}
                                                                className="bg-white rounded-3 p-3 mb-3 shadow-sm"
                                                            >

                                                                <div className="d-flex justify-content-between align-items-center mb-2">

                                                                    <span className="fw-semibold">
                                                                        <i className="bi bi-person-circle text-primary me-2" />
                                                                        {mainMessage.sender_username}
                                                                    </span>

                                                                    <small className="text-muted">
                                                                        {getTimeAgo(
                                                                            mainMessage.created_at
                                                                        )}
                                                                    </small>

                                                                </div>

                                                                <p className="mb-3">
                                                                    {mainMessage.message}
                                                                </p>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() =>
                                                                        handleReplyToggle(
                                                                            mainMessage.id
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bi bi-reply me-1" />

                                                                    {replyToMessageId ===
                                                                    mainMessage.id
                                                                        ? 'Cancel Reply'
                                                                        : 'Reply'}
                                                                </button>

                                                                {getReplies(
                                                                    mainMessage.id
                                                                ).map(
                                                                    (reply) => (

                                                                        <div
                                                                            key={reply.id}
                                                                            className="bg-light rounded-3 p-3 mt-3 ms-4"
                                                                        >

                                                                            <div className="d-flex justify-content-between align-items-center mb-2">

                                                                                <span className="fw-semibold">
                                                                                    <i className="bi bi-arrow-return-right text-primary me-2" />
                                                                                    {reply.sender_username}
                                                                                </span>

                                                                                <small className="text-muted">
                                                                                    {getTimeAgo(
                                                                                        reply.created_at
                                                                                    )}
                                                                                </small>

                                                                            </div>

                                                                            <p className="mb-0">
                                                                                {reply.message}
                                                                            </p>

                                                                        </div>

                                                                    )
                                                                )}

                                                                {replyToMessageId ===
                                                                    mainMessage.id && (

                                                                    <form
                                                                        className="mt-3 ms-4"
                                                                        onSubmit={(
                                                                            event
                                                                        ) =>
                                                                            handleSendReply(
                                                                                event,
                                                                                mainMessage.id
                                                                            )
                                                                        }
                                                                    >

                                                                        <div className="input-group">

                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Write a reply..."
                                                                                value={
                                                                                    replyMessage
                                                                                }
                                                                                onChange={(
                                                                                    event
                                                                                ) =>
                                                                                    setReplyMessage(
                                                                                        event.target.value
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    sendingReply
                                                                                }
                                                                            />

                                                                            <button
                                                                                type="submit"
                                                                                className="btn btn-primary"
                                                                                disabled={
                                                                                    sendingReply
                                                                                }
                                                                            >
                                                                                <i className="bi bi-send me-1" />

                                                                                {sendingReply
                                                                                    ? 'Sending...'
                                                                                    : 'Reply'}
                                                                            </button>

                                                                        </div>

                                                                        {replyError && (
                                                                            <div className="text-danger small mt-2">
                                                                                {replyError}
                                                                            </div>
                                                                        )}

                                                                    </form>

                                                                )}

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            )}

                                            {messageError && (
                                                <div className="text-danger small mb-2">
                                                    {messageError}
                                                </div>
                                            )}

                                            <form onSubmit={handleSendMessage}>

                                                <div className="input-group">

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Write a message related to this job..."
                                                        value={message}
                                                        onChange={(event) =>
                                                            setMessage(
                                                                event.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            sendingMessage
                                                        }
                                                    />

                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        disabled={
                                                            sendingMessage
                                                        }
                                                    >
                                                        <i className="bi bi-send me-1" />

                                                        {sendingMessage
                                                            ? 'Sending...'
                                                            : 'Send'}
                                                    </button>

                                                </div>

                                            </form>

                                        </div>

                                    )}

                                    {activeSection === 'offer' && (

                                        <div className="bg-light rounded-3 p-4 mb-4">

                                            <div className="d-flex justify-content-between align-items-center mb-4">

                                                <div>

                                                    <h6 className="fw-bold mb-1">
                                                        <i className="bi bi-send text-primary me-2" />
                                                        Send an Offer
                                                    </h6>

                                                    <small className="text-muted">
                                                        Make an offer for this job
                                                    </small>

                                                </div>

                                                <span className="badge bg-primary">
                                                    New Offer
                                                </span>

                                            </div>

                                            {offerError && (
                                                <div className="alert alert-danger border-0">
                                                    {offerError}
                                                </div>
                                            )}

                                            <form onSubmit={handleSendOffer}>

                                                <div className="row g-3">

                                                    <div className="col-md-6">

                                                        <label className="form-label fw-semibold">
                                                            Your price
                                                        </label>

                                                        <div className="input-group">

                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter price"
                                                                min="0"
                                                                value={
                                                                    offerPrice
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setOfferPrice(
                                                                        event.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    sendingOffer
                                                                }
                                                                required
                                                            />

                                                            <span className="input-group-text">
                                                                KM
                                                            </span>

                                                        </div>

                                                    </div>

                                                    <div className="col-md-6">

                                                        <label className="form-label fw-semibold">
                                                            Delivery time
                                                        </label>

                                                        <div className="input-group">

                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Number of days"
                                                                min="1"
                                                                value={
                                                                    deliveryDays
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setDeliveryDays(
                                                                        event.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    sendingOffer
                                                                }
                                                                required
                                                            />

                                                            <span className="input-group-text">
                                                                days
                                                            </span>

                                                        </div>

                                                    </div>

                                                    <div className="col-12">

                                                        <label className="form-label fw-semibold">
                                                            Offer message
                                                        </label>

                                                        <textarea
                                                            className="form-control"
                                                            rows="3"
                                                            placeholder="Write a message about your offer..."
                                                            value={
                                                                offerMessage
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                setOfferMessage(
                                                                    event.target.value
                                                                )
                                                            }
                                                            disabled={
                                                                sendingOffer
                                                            }
                                                        />

                                                    </div>

                                                </div>

                                                <div className="d-flex justify-content-end mt-4">

                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary px-4"
                                                        disabled={
                                                            sendingOffer
                                                        }
                                                    >
                                                        <i className="bi bi-send me-2" />

                                                        {sendingOffer
                                                            ? 'Sending...'
                                                            : 'Send Offer'}
                                                    </button>

                                                </div>

                                            </form>

                                        </div>

                                    )}

                                </div>

                                <div className="modal-footer px-4 py-3">

                                    <div className="d-flex gap-2">

                                        <button
                                            type="button"
                                            className={
                                                activeSection === 'messages'
                                                    ? 'btn btn-primary'
                                                    : 'btn btn-outline-primary'
                                            }
                                            onClick={() =>
                                                handleSectionToggle(
                                                    'messages'
                                                )
                                            }
                                        >
                                            <i className="bi bi-chat-dots me-1" />
                                            Messages
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                activeSection === 'offer'
                                                    ? 'btn btn-primary'
                                                    : 'btn btn-outline-primary'
                                            }
                                            onClick={() =>
                                                handleSectionToggle(
                                                    'offer'
                                                )
                                            }
                                        >
                                            <i className="bi bi-send me-1" />
                                            Send Offer
                                        </button>

                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeJobModal}
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                </>
            )}

        </div>
    )
}

export default Jobs
