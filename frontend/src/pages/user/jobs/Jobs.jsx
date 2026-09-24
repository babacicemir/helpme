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

        const diffInMinutes = Math.floor(
            diffInSeconds / 60
        )

        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${
                diffInMinutes === 1 ? 'minute' : 'minutes'
            } ago`
        }

        const diffInHours = Math.floor(
            diffInMinutes / 60
        )

        if (diffInHours < 24) {
            return `${diffInHours} ${
                diffInHours === 1 ? 'hour' : 'hours'
            } ago`
        }

        const diffInDays = Math.floor(
            diffInHours / 24
        )

        if (diffInDays < 30) {
            return `${diffInDays} ${
                diffInDays === 1 ? 'day' : 'days'
            } ago`
        }

        const diffInMonths = Math.floor(
            diffInDays / 30
        )

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
        <div className="container py-5">

            <div className="mb-5">
                <h1 className="fw-bold mb-2">
                    Find Jobs
                </h1>

                <p className="text-muted mb-0">
                    Browse jobs posted by the HelpMe.ba community
                </p>
            </div>

            {loadingJobs ? (

                <div className="text-center py-5">
                    <p className="text-muted mb-0">
                        Loading jobs...
                    </p>
                </div>

            ) : jobsError ? (

                <div className="alert alert-danger">
                    {jobsError}
                </div>

            ) : jobs.length === 0 ? (

                <div className="text-center py-5">
                    <h5 className="fw-semibold mb-2">
                        No jobs available
                    </h5>

                    <p className="text-muted mb-0">
                        There are currently no open jobs.
                    </p>
                </div>

            ) : (

                <div className="row g-4">

                    {jobs.map((job) => (

                        <div
                            className="col-md-6 col-xl-4"
                            key={job.id}
                        >

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body d-flex flex-column">

                                    <div className="d-flex justify-content-between align-items-start mb-3">

                                        <span className="badge bg-primary">
                                            {job.category}
                                        </span>

                                        <small className="text-muted">
                                            {getTimeAgo(
                                                job.created_at
                                            )}
                                        </small>

                                    </div>

                                    <h5 className="fw-bold mb-3">
                                        {job.title}
                                    </h5>

                                    <p className="text-muted mb-4">
                                        {job.description}
                                    </p>

                                    <div className="mt-auto">

                                        <div className="d-flex justify-content-between mb-2">

                                            <span className="text-muted">
                                                Posted by
                                            </span>

                                            <span className="fw-medium">
                                                {job.username}
                                            </span>

                                        </div>

                                        <div className="d-flex justify-content-between mb-2">

                                            <span className="text-muted">
                                                Location
                                            </span>

                                            <span className="fw-medium">
                                                {job.location ||
                                                    'Not specified'}
                                            </span>

                                        </div>

                                        <div className="d-flex justify-content-between mb-3">

                                            <span className="text-muted">
                                                Budget
                                            </span>

                                            <span className="fw-semibold">
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
                                            View Job
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {selectedJob && (

                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                >

                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">

                        <div className="modal-content border-0 shadow">

                            <div className="modal-header">

                                <div>
                                    <h5 className="modal-title fw-bold mb-1">
                                        {selectedJob.title}
                                    </h5>

                                    <small className="text-muted">
                                        Posted by {selectedJob.username}
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeJobModal}
                                />

                            </div>

                            <div className="modal-body">

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <span className="badge bg-primary">
                                        {selectedJob.category}
                                    </span>

                                    <span className="badge bg-success">
                                        {selectedJob.status}
                                    </span>

                                </div>

                                <div className="mb-4">

                                    <h6 className="fw-bold mb-2">
                                        Job Description
                                    </h6>

                                    <p className="text-muted mb-0">
                                        {selectedJob.description}
                                    </p>

                                </div>

                                <div className="row g-3 mb-4">

                                    <div className="col-md-4">

                                        <div className="bg-light rounded p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Budget
                                            </small>

                                            <span className="fw-semibold">
                                                {selectedJob.budget} KM
                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="bg-light rounded p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Location
                                            </small>

                                            <span className="fw-semibold">
                                                {selectedJob.location ||
                                                    'Not specified'}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="bg-light rounded p-3 h-100">

                                            <small className="text-muted d-block mb-1">
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

                                <div className="row g-3 mb-4">

                                    <div className="col-md-6">

                                        <div className="border rounded p-3">

                                            <small className="text-muted d-block mb-1">
                                                Posted by
                                            </small>

                                            <span className="fw-semibold">
                                                {selectedJob.username}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="border rounded p-3">

                                            <small className="text-muted d-block mb-1">
                                                Posted
                                            </small>

                                            <span className="fw-semibold">
                                                {getTimeAgo(
                                                    selectedJob.created_at
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <hr className="my-4" />

                                {successMessage && (
                                    <div className="alert alert-success">
                                        {successMessage}
                                    </div>
                                )}

                                {activeSection === 'messages' && (

                                    <div className="border rounded p-3 mb-4">

                                        <div className="d-flex justify-content-between align-items-center mb-3">

                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    Messages related to this job
                                                </h6>

                                                <small className="text-muted">
                                                    Discussion about this job
                                                </small>
                                            </div>

                                            <span className="badge bg-primary">
                                                Open
                                            </span>

                                        </div>

                                        {loadingMessages ? (

                                            <div className="bg-light rounded p-3 mb-3 text-center">
                                                <p className="text-muted mb-0">
                                                    Loading messages...
                                                </p>
                                            </div>

                                        ) : messagesError ? (

                                            <div className="alert alert-danger">
                                                {messagesError}
                                            </div>

                                        ) : mainMessages.length === 0 ? (

                                            <div className="bg-light rounded p-3 mb-3">
                                                <p className="text-muted mb-0">
                                                    No messages yet. Start a
                                                    discussion about this job.
                                                </p>
                                            </div>

                                        ) : (

                                            <div className="mb-3">

                                                {mainMessages.map(
                                                    (mainMessage) => (

                                                        <div
                                                            key={mainMessage.id}
                                                            className="border rounded p-3 mb-3"
                                                        >

                                                            <div className="d-flex justify-content-between align-items-center mb-2">

                                                                <span className="fw-semibold">
                                                                    {
                                                                        mainMessage.sender_username
                                                                    }
                                                                </span>

                                                                <small className="text-muted">
                                                                    {getTimeAgo(
                                                                        mainMessage.created_at
                                                                    )}
                                                                </small>

                                                            </div>

                                                            <p className="mb-2">
                                                                {
                                                                    mainMessage.message
                                                                }
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
                                                                        className="bg-light rounded p-3 mt-3 ms-4"
                                                                    >

                                                                        <div className="d-flex justify-content-between align-items-center mb-2">

                                                                            <span className="fw-semibold">
                                                                                {
                                                                                    reply.sender_username
                                                                                }
                                                                            </span>

                                                                            <small className="text-muted">
                                                                                {getTimeAgo(
                                                                                    reply.created_at
                                                                                )}
                                                                            </small>

                                                                        </div>

                                                                        <p className="mb-0">
                                                                            {
                                                                                reply.message
                                                                            }
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
                                                                                    event
                                                                                        .target
                                                                                        .value
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
                                                                            {sendingReply
                                                                                ? 'Sending...'
                                                                                : 'Reply'}
                                                                        </button>

                                                                    </div>

                                                                    {replyError && (
                                                                        <div className="text-danger small mt-2">
                                                                            {
                                                                                replyError
                                                                            }
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

                                        <form
                                            onSubmit={handleSendMessage}
                                        >

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
                                                    {sendingMessage
                                                        ? 'Sending...'
                                                        : 'Send'}
                                                </button>

                                            </div>

                                        </form>

                                    </div>

                                )}

                                {activeSection === 'offer' && (

                                    <div className="border rounded p-3 mb-4">

                                        <div className="d-flex justify-content-between align-items-center mb-3">

                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    Send an offer
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
                                            <div className="alert alert-danger">
                                                {offerError}
                                            </div>
                                        )}

                                        <form
                                            onSubmit={handleSendOffer}
                                        >

                                            <div className="row g-3">

                                                <div className="col-md-6">

                                                    <label className="form-label">
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

                                                    <label className="form-label">
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

                                                    <label className="form-label">
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

                                            <div className="d-flex justify-content-end mt-3">

                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    disabled={
                                                        sendingOffer
                                                    }
                                                >
                                                    {sendingOffer
                                                        ? 'Sending...'
                                                        : 'Send Offer'}
                                                </button>

                                            </div>

                                        </form>

                                    </div>

                                )}

                            </div>

                            <div className="modal-footer d-flex justify-content-between">

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
                                        💬 Messages
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

            )}

        </div>
    )
}

export default Jobs
