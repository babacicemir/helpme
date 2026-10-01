import { useEffect, useState } from 'react'
import {
    getUserJobs,
    getCategories,
    createJob,
    updateJob,
    deleteJob
} from '../../../services/userService'
import OffersModal from '../offers/OffersModal'

function MyJobs() {
    const [jobs, setJobs] = useState([])
    const [categories, setCategories] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [selectedJob, setSelectedJob] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const [showOffersModal, setShowOffersModal] = useState(false)
    const [selectedOffersJob, setSelectedOffersJob] = useState(null)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [creatingJob, setCreatingJob] = useState(false)
    const [createError, setCreateError] = useState('')

    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [updatingJob, setUpdatingJob] = useState(false)
    const [updateError, setUpdateError] = useState('')

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [budget, setBudget] = useState('')
    const [deadline, setDeadline] = useState('')
    const [location, setLocation] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError('')

                const [jobsResponse, categoriesResponse] =
                    await Promise.all([
                        getUserJobs(),
                        getCategories()
                    ])

                setJobs(jobsResponse.data)
                setCategories(categoriesResponse.data)
            } catch (error) {
                console.error('MY JOBS ERROR:', error)

                setError(
                    error.response?.data?.message ||
                    'Failed to load your jobs'
                )
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    const openJobModal = (job) => {
        setSelectedJob(job)
        setSuccessMessage('')
    }

    const closeJobModal = () => {
        setSelectedJob(null)
    }

    const openOffersModal = (job) => {
        setSelectedOffersJob(job)
        setShowOffersModal(true)
    }

    const closeOffersModal = () => {
        setShowOffersModal(false)
        setSelectedOffersJob(null)
    }

    const openCreateModal = () => {
        setTitle('')
        setDescription('')
        setCategoryId('')
        setBudget('')
        setDeadline('')
        setLocation('')
        setCreateError('')
        setShowCreateModal(true)
    }

    const closeCreateModal = () => {
        if (creatingJob) {
            return
        }

        setShowCreateModal(false)
        setCreateError('')
    }

    const handleCreateJob = async (event) => {
        event.preventDefault()

        if (
            !title.trim() ||
            !description.trim() ||
            !categoryId ||
            !budget ||
            !deadline ||
            !location.trim()
        ) {
            setCreateError('Please fill in all fields')
            return
        }

        try {
            setCreatingJob(true)
            setCreateError('')
            setError('')

            const response = await createJob(
                categoryId,
                title.trim(),
                description.trim(),
                budget,
                deadline,
                location.trim()
            )

            setJobs((currentJobs) => [
                response.data,
                ...currentJobs
            ])

            setShowCreateModal(false)

            setTitle('')
            setDescription('')
            setCategoryId('')
            setBudget('')
            setDeadline('')
            setLocation('')

            setSuccessMessage('Job created successfully')
        } catch (error) {
            console.error('CREATE JOB ERROR:', error)

            setCreateError(
                error.response?.data?.message ||
                'Failed to create job'
            )
        } finally {
            setCreatingJob(false)
        }
    }

    const openUpdateModal = () => {
        if (!selectedJob) {
            return
        }

        setTitle(selectedJob.title || '')
        setDescription(selectedJob.description || '')
        setCategoryId(
            selectedJob.category_id
                ? String(selectedJob.category_id)
                : ''
        )
        setBudget(
            selectedJob.budget !== null &&
            selectedJob.budget !== undefined
                ? String(selectedJob.budget)
                : ''
        )
        setDeadline(
            selectedJob.deadline
                ? selectedJob.deadline.substring(0, 10)
                : ''
        )
        setLocation(selectedJob.location || '')

        setUpdateError('')
        setShowUpdateModal(true)
    }

    const closeUpdateModal = () => {
        if (updatingJob) {
            return
        }

        setShowUpdateModal(false)
        setUpdateError('')
    }

    const handleUpdateJob = async (event) => {
        event.preventDefault()

        if (!selectedJob) {
            return
        }

        if (
            !title.trim() ||
            !description.trim() ||
            !categoryId ||
            !budget ||
            !deadline ||
            !location.trim()
        ) {
            setUpdateError('Please fill in all fields')
            return
        }

        try {
            setUpdatingJob(true)
            setUpdateError('')
            setError('')

            const response = await updateJob(
                selectedJob.id,
                categoryId,
                title.trim(),
                description.trim(),
                budget,
                deadline,
                location.trim()
            )

            setJobs((currentJobs) =>
                currentJobs.map((job) =>
                    job.id === selectedJob.id
                        ? response.data
                        : job
                )
            )

            setSelectedJob(response.data)
            setShowUpdateModal(false)
            setSuccessMessage('Job updated successfully')
        } catch (error) {
            console.error('UPDATE JOB ERROR:', error)

            setUpdateError(
                error.response?.data?.message ||
                'Failed to update job'
            )
        } finally {
            setUpdatingJob(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedJob) {
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete this job?'
        )

        if (!confirmed) {
            return
        }

        try {
            setDeleting(true)
            setError('')
            setSuccessMessage('')

            await deleteJob(selectedJob.id)

            setJobs((currentJobs) =>
                currentJobs.filter(
                    (job) => job.id !== selectedJob.id
                )
            )

            setSelectedJob(null)
            setSuccessMessage('Job deleted successfully')
        } catch (error) {
            console.error('DELETE JOB ERROR:', error)

            setError(
                error.response?.data?.message ||
                'Failed to delete job'
            )
        } finally {
            setDeleting(false)
        }
    }

    const getStatusClass = (status) => {
        if (status === 'OPEN') {
            return 'bg-success bg-opacity-10 text-success'
        }

        if (status === 'COMPLETED') {
            return 'bg-primary bg-opacity-10 text-primary'
        }

        if (status === 'CANCELLED') {
            return 'bg-danger bg-opacity-10 text-danger'
        }

        return 'bg-secondary bg-opacity-10 text-secondary'
    }

    if (loading) {
        return (
            <div className="bg-light min-vh-100 py-5">

                <div className="container">

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
                                Loading your jobs...
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        )
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
                                My Jobs
                            </h1>

                            <p className="text-muted mb-0">
                                Manage the jobs you have created.
                            </p>

                        </div>

                        <div className="d-flex align-items-center gap-3">

                            <div className="bg-white rounded-3 shadow-sm px-4 py-3">

                                <div className="d-flex align-items-center gap-3">

                                    <div
                                        className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '44px',
                                            height: '44px'
                                        }}
                                    >
                                        <i className="bi bi-briefcase fs-5" />
                                    </div>

                                    <div>

                                        <small className="text-muted d-block">
                                            Total Jobs
                                        </small>

                                        <span className="fw-bold fs-5">
                                            {jobs.length}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="btn btn-primary px-4"
                                onClick={openCreateModal}
                            >
                                <i className="bi bi-plus-lg me-2" />
                                Create Job
                            </button>

                        </div>

                    </div>

                </div>

                {successMessage && (
                    <div className="alert alert-success border-0 shadow-sm d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2" />
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center">
                        <i className="bi bi-exclamation-circle-fill me-2" />
                        {error}
                    </div>
                )}

                {jobs.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div
                                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{
                                    width: '70px',
                                    height: '70px'
                                }}
                            >
                                <i className="bi bi-briefcase fs-3" />
                            </div>

                            <h4 className="fw-bold mb-2">
                                You haven't created any jobs yet
                            </h4>

                            <p className="text-muted mb-4">
                                Create your first job and find someone
                                to help you.
                            </p>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={openCreateModal}
                            >
                                <i className="bi bi-plus-lg me-2" />
                                Create Your First Job
                            </button>

                        </div>

                    </div>

                ) : (

                    <div className="row g-4">

                        {jobs.map((job) => (

                            <div
                                className="col-12 col-md-6"
                                key={job.id}
                            >

                                <div
                                    className="card h-100 border-0 shadow-sm"
                                    style={{
                                        borderRadius: '14px'
                                    }}
                                >

                                    <div className="card-body p-4 d-flex flex-column">

                                        <div className="d-flex justify-content-between align-items-start mb-3">

                                            <div
                                                className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '44px',
                                                    height: '44px'
                                                }}
                                            >
                                                <i className="bi bi-briefcase fs-5" />
                                            </div>

                                            <span
                                                className={`badge px-3 py-2 ${getStatusClass(
                                                    job.status
                                                )}`}
                                            >
                                                {job.status}
                                            </span>

                                        </div>

                                        <h5 className="fw-bold mb-2">
                                            {job.title}
                                        </h5>

                                        <p className="text-muted mb-4">
                                            {job.description}
                                        </p>

                                        <div className="border-top pt-3 mt-auto">

                                            <div className="row g-3 mb-4">

                                                <div className="col-6">

                                                    <small className="text-muted d-block mb-1">
                                                        <i className="bi bi-cash me-1" />
                                                        Budget
                                                    </small>

                                                    <strong className="text-primary">
                                                        {job.budget} KM
                                                    </strong>

                                                </div>

                                                <div className="col-6">

                                                    <small className="text-muted d-block mb-1">
                                                        <i className="bi bi-geo-alt me-1" />
                                                        Location
                                                    </small>

                                                    <strong>
                                                        {job.location}
                                                    </strong>

                                                </div>

                                            </div>

                                            <div className="d-flex gap-2">

                                                <button
                                                    type="button"
                                                    className="btn btn-primary flex-fill"
                                                    onClick={() =>
                                                        openJobModal(job)
                                                    }
                                                >
                                                    <i className="bi bi-eye me-1" />
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary flex-fill"
                                                    onClick={() =>
                                                        openOffersModal(job)
                                                    }
                                                >
                                                    <i className="bi bi-chat-square-text me-1" />
                                                    Offers
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

            {selectedJob && !showUpdateModal && (

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

                        <div className="modal-dialog modal-lg modal-dialog-centered">

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
                                                Job details
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

                                        <span
                                            className={`badge px-3 py-2 ${getStatusClass(
                                                selectedJob.status
                                            )}`}
                                        >
                                            {selectedJob.status}
                                        </span>

                                    </div>

                                    <div className="bg-light rounded-3 p-4 mb-4">

                                        <div className="d-flex align-items-center mb-2">

                                            <i className="bi bi-card-text text-primary me-2" />

                                            <h6 className="fw-bold mb-0">
                                                Description
                                            </h6>

                                        </div>

                                        <p className="text-muted mb-0">
                                            {selectedJob.description}
                                        </p>

                                    </div>

                                    <div className="row g-3">

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-2">
                                                    <i className="bi bi-cash text-primary me-1" />
                                                    Budget
                                                </small>

                                                <strong className="text-primary">
                                                    {selectedJob.budget} KM
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-2">
                                                    <i className="bi bi-geo-alt text-primary me-1" />
                                                    Location
                                                </small>

                                                <strong>
                                                    {selectedJob.location}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-2">
                                                    <i className="bi bi-calendar-event text-primary me-1" />
                                                    Deadline
                                                </small>

                                                <strong>
                                                    {selectedJob.deadline
                                                        ? new Date(
                                                            selectedJob.deadline
                                                        ).toLocaleDateString()
                                                        : 'Not specified'}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-2">
                                                    <i className="bi bi-info-circle text-primary me-1" />
                                                    Status
                                                </small>

                                                <strong>
                                                    {selectedJob.status}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="col-12">

                                            <div className="bg-light rounded-3 p-3">

                                                <small className="text-muted d-block mb-2">
                                                    <i className="bi bi-calendar-plus text-primary me-1" />
                                                    Created
                                                </small>

                                                <strong>
                                                    {selectedJob.created_at
                                                        ? new Date(
                                                            selectedJob.created_at
                                                        ).toLocaleDateString()
                                                        : 'Not specified'}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="modal-footer px-4 py-3">

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={openUpdateModal}
                                    >
                                        <i className="bi bi-pencil me-1" />
                                        Update
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                    >
                                        <i className="bi bi-trash me-1" />

                                        {deleting
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>

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

            {showOffersModal && selectedOffersJob && (
                <OffersModal
                    job={selectedOffersJob}
                    onClose={closeOffersModal}
                />
            )}

            {showCreateModal && (

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

                        <div className="modal-dialog modal-lg modal-dialog-centered">

                            <div className="modal-content border-0 shadow-lg">

                                <form onSubmit={handleCreateJob}>

                                    <div className="modal-header px-4 py-3">

                                        <div className="d-flex align-items-center">

                                            <div
                                                className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '46px',
                                                    height: '46px'
                                                }}
                                            >
                                                <i className="bi bi-plus-lg fs-5" />
                                            </div>

                                            <div>

                                                <h5 className="modal-title fw-bold mb-1">
                                                    Create Job
                                                </h5>

                                                <small className="text-muted">
                                                    Create a new job request
                                                </small>

                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={closeCreateModal}
                                            disabled={creatingJob}
                                            aria-label="Close"
                                        />

                                    </div>

                                    <div className="modal-body px-4 py-4">

                                        {createError && (
                                            <div className="alert alert-danger border-0">
                                                <i className="bi bi-exclamation-circle me-2" />
                                                {createError}
                                            </div>
                                        )}

                                        <div className="mb-3">

                                            <label
                                                htmlFor="jobTitle"
                                                className="form-label fw-semibold"
                                            >
                                                Title
                                            </label>

                                            <input
                                                id="jobTitle"
                                                type="text"
                                                className="form-control"
                                                value={title}
                                                onChange={(event) =>
                                                    setTitle(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter job title"
                                                disabled={creatingJob}
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label
                                                htmlFor="jobDescription"
                                                className="form-label fw-semibold"
                                            >
                                                Description
                                            </label>

                                            <textarea
                                                id="jobDescription"
                                                className="form-control"
                                                rows="4"
                                                value={description}
                                                onChange={(event) =>
                                                    setDescription(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Describe what you need help with"
                                                disabled={creatingJob}
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label
                                                htmlFor="jobCategory"
                                                className="form-label fw-semibold"
                                            >
                                                Category
                                            </label>

                                            <select
                                                id="jobCategory"
                                                className="form-select"
                                                value={categoryId}
                                                onChange={(event) =>
                                                    setCategoryId(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={creatingJob}
                                            >

                                                <option value="">
                                                    Select a category
                                                </option>

                                                {categories.map(
                                                    (category) => (

                                                        <option
                                                            key={category.id}
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>

                                        <div className="row">

                                            <div className="col-md-6 mb-3">

                                                <label
                                                    htmlFor="jobBudget"
                                                    className="form-label fw-semibold"
                                                >
                                                    Budget (KM)
                                                </label>

                                                <input
                                                    id="jobBudget"
                                                    type="number"
                                                    className="form-control"
                                                    value={budget}
                                                    onChange={(event) =>
                                                        setBudget(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Enter budget"
                                                    min="0"
                                                    step="0.01"
                                                    disabled={creatingJob}
                                                />

                                            </div>

                                            <div className="col-md-6 mb-3">

                                                <label
                                                    htmlFor="jobDeadline"
                                                    className="form-label fw-semibold"
                                                >
                                                    Deadline
                                                </label>

                                                <input
                                                    id="jobDeadline"
                                                    type="date"
                                                    className="form-control"
                                                    value={deadline}
                                                    onChange={(event) =>
                                                        setDeadline(
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={creatingJob}
                                                />

                                            </div>

                                        </div>

                                        <div className="mb-3">

                                            <label
                                                htmlFor="jobLocation"
                                                className="form-label fw-semibold"
                                            >
                                                Location
                                            </label>

                                            <input
                                                id="jobLocation"
                                                type="text"
                                                className="form-control"
                                                value={location}
                                                onChange={(event) =>
                                                    setLocation(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter location"
                                                disabled={creatingJob}
                                            />

                                        </div>

                                    </div>

                                    <div className="modal-footer px-4 py-3">

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeCreateModal}
                                            disabled={creatingJob}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4"
                                            disabled={creatingJob}
                                        >
                                            <i className="bi bi-plus-lg me-1" />

                                            {creatingJob
                                                ? 'Creating...'
                                                : 'Create Job'}
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>
                </>
            )}

            {showUpdateModal && selectedJob && (

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

                        <div className="modal-dialog modal-lg modal-dialog-centered">

                            <div className="modal-content border-0 shadow-lg">

                                <form onSubmit={handleUpdateJob}>

                                    <div className="modal-header px-4 py-3">

                                        <div className="d-flex align-items-center">

                                            <div
                                                className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '46px',
                                                    height: '46px'
                                                }}
                                            >
                                                <i className="bi bi-pencil fs-5" />
                                            </div>

                                            <div>

                                                <h5 className="modal-title fw-bold mb-1">
                                                    Update Job
                                                </h5>

                                                <small className="text-muted">
                                                    Update your job information
                                                </small>

                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={closeUpdateModal}
                                            disabled={updatingJob}
                                            aria-label="Close"
                                        />

                                    </div>

                                    <div className="modal-body px-4 py-4">

                                        {updateError && (
                                            <div className="alert alert-danger border-0">
                                                <i className="bi bi-exclamation-circle me-2" />
                                                {updateError}
                                            </div>
                                        )}

                                        <div className="mb-3">

                                            <label
                                                htmlFor="updateJobTitle"
                                                className="form-label fw-semibold"
                                            >
                                                Title
                                            </label>

                                            <input
                                                id="updateJobTitle"
                                                type="text"
                                                className="form-control"
                                                value={title}
                                                onChange={(event) =>
                                                    setTitle(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={updatingJob}
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label
                                                htmlFor="updateJobDescription"
                                                className="form-label fw-semibold"
                                            >
                                                Description
                                            </label>

                                            <textarea
                                                id="updateJobDescription"
                                                className="form-control"
                                                rows="4"
                                                value={description}
                                                onChange={(event) =>
                                                    setDescription(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={updatingJob}
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label
                                                htmlFor="updateJobCategory"
                                                className="form-label fw-semibold"
                                            >
                                                Category
                                            </label>

                                            <select
                                                id="updateJobCategory"
                                                className="form-select"
                                                value={categoryId}
                                                onChange={(event) =>
                                                    setCategoryId(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={updatingJob}
                                            >

                                                <option value="">
                                                    Select a category
                                                </option>

                                                {categories.map(
                                                    (category) => (

                                                        <option
                                                            key={category.id}
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>

                                        <div className="row">

                                            <div className="col-md-6 mb-3">

                                                <label
                                                    htmlFor="updateJobBudget"
                                                    className="form-label fw-semibold"
                                                >
                                                    Budget (KM)
                                                </label>

                                                <input
                                                    id="updateJobBudget"
                                                    type="number"
                                                    className="form-control"
                                                    value={budget}
                                                    onChange={(event) =>
                                                        setBudget(
                                                            event.target.value
                                                        )
                                                    }
                                                    min="0"
                                                    step="0.01"
                                                    disabled={updatingJob}
                                                />

                                            </div>

                                            <div className="col-md-6 mb-3">

                                                <label
                                                    htmlFor="updateJobDeadline"
                                                    className="form-label fw-semibold"
                                                >
                                                    Deadline
                                                </label>

                                                <input
                                                    id="updateJobDeadline"
                                                    type="date"
                                                    className="form-control"
                                                    value={deadline}
                                                    onChange={(event) =>
                                                        setDeadline(
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={updatingJob}
                                                />

                                            </div>

                                        </div>

                                        <div className="mb-3">

                                            <label
                                                htmlFor="updateJobLocation"
                                                className="form-label fw-semibold"
                                            >
                                                Location
                                            </label>

                                            <input
                                                id="updateJobLocation"
                                                type="text"
                                                className="form-control"
                                                value={location}
                                                onChange={(event) =>
                                                    setLocation(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={updatingJob}
                                            />

                                        </div>

                                    </div>

                                    <div className="modal-footer px-4 py-3">

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeUpdateModal}
                                            disabled={updatingJob}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4"
                                            disabled={updatingJob}
                                        >
                                            <i className="bi bi-check-lg me-1" />

                                            {updatingJob
                                                ? 'Updating...'
                                                : 'Update Job'}
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>
                </>
            )}

        </div>
    )
}

export default MyJobs
