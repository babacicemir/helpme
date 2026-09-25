import { useEffect, useState } from 'react'
import {
    getUserJobs,
    getCategories,
    createJob,
    updateJob,
    deleteJob
} from '../../../services/userService'

function MyJobs() {
    const [jobs, setJobs] = useState([])
    const [categories, setCategories] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [selectedJob, setSelectedJob] = useState(null)
    const [deleting, setDeleting] = useState(false)

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
    }

    const closeJobModal = () => {
        setSelectedJob(null)
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

            await deleteJob(selectedJob.id)

            setJobs((currentJobs) =>
                currentJobs.filter(
                    (job) => job.id !== selectedJob.id
                )
            )

            setSelectedJob(null)
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

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <p className="mb-0">
                        Loading your jobs...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        My Jobs
                    </h2>

                    <p className="text-muted mb-0">
                        Manage the jobs you have created.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openCreateModal}
                >
                    + Create Job
                </button>
            </div>

            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {jobs.length === 0 ? (
                <div className="text-center py-5">
                    <h4 className="fw-bold">
                        Ouuppss! You didn't create any jobs yet.
                    </h4>

                    <p className="text-muted">
                        Create your first job and find someone
                        to help you.
                    </p>
                </div>
            ) : (
                <div className="row g-4">
                    {jobs.map((job) => (
                        <div
                            className="col-12 col-md-6"
                            key={job.id}
                        >
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="card-title fw-bold mb-0">
                                            {job.title}
                                        </h5>

                                        <span className="badge bg-primary">
                                            {job.status}
                                        </span>
                                    </div>

                                    <p className="card-text text-muted">
                                        {job.description}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="row mb-3">
                                            <div className="col-6">
                                                <small className="text-muted d-block">
                                                    Budget
                                                </small>

                                                <strong>
                                                    {job.budget} KM
                                                </strong>
                                            </div>

                                            <div className="col-6">
                                                <small className="text-muted d-block">
                                                    Location
                                                </small>

                                                <strong>
                                                    {job.location}
                                                </strong>
                                            </div>
                                        </div>

                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() =>
                                                openJobModal(job)
                                            }
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedJob && !showUpdateModal && (
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
                                    <h5 className="modal-title fw-bold">
                                        {selectedJob.title}
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closeJobModal}
                                        aria-label="Close"
                                    />
                                </div>

                                <div className="modal-body">
                                    <div className="mb-4">
                                        <h6 className="fw-bold">
                                            Description
                                        </h6>

                                        <p className="text-muted mb-0">
                                            {selectedJob.description}
                                        </p>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <div className="border rounded p-3">
                                                <small className="text-muted d-block">
                                                    Budget
                                                </small>

                                                <strong>
                                                    {selectedJob.budget} KM
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="border rounded p-3">
                                                <small className="text-muted d-block">
                                                    Location
                                                </small>

                                                <strong>
                                                    {selectedJob.location}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="border rounded p-3">
                                                <small className="text-muted d-block">
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

                                        <div className="col-12 col-md-6">
                                            <div className="border rounded p-3">
                                                <small className="text-muted d-block">
                                                    Status
                                                </small>

                                                <strong>
                                                    {selectedJob.status}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="border rounded p-3">
                                                <small className="text-muted d-block">
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

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={openUpdateModal}
                                    >
                                        Update
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                    >
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

                    <div
                        className="modal-backdrop fade show"
                        style={{ zIndex: 1040 }}
                        onClick={closeJobModal}
                    />
                </>
            )}

            {showCreateModal && (
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
                                <form onSubmit={handleCreateJob}>
                                    <div className="modal-header">
                                        <h5 className="modal-title fw-bold">
                                            Create Job
                                        </h5>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={closeCreateModal}
                                            disabled={creatingJob}
                                            aria-label="Close"
                                        />
                                    </div>

                                    <div className="modal-body">
                                        {createError && (
                                            <div
                                                className="alert alert-danger"
                                                role="alert"
                                            >
                                                {createError}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label
                                                htmlFor="jobTitle"
                                                className="form-label"
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
                                                className="form-label"
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
                                                className="form-label"
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
                                            <div className="col-12 col-md-6 mb-3">
                                                <label
                                                    htmlFor="jobBudget"
                                                    className="form-label"
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

                                            <div className="col-12 col-md-6 mb-3">
                                                <label
                                                    htmlFor="jobDeadline"
                                                    className="form-label"
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
                                                className="form-label"
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

                                    <div className="modal-footer">
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
                                            className="btn btn-primary"
                                            disabled={creatingJob}
                                        >
                                            {creatingJob
                                                ? 'Creating...'
                                                : 'Create Job'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div
                        className="modal-backdrop fade show"
                        style={{ zIndex: 1040 }}
                        onClick={closeCreateModal}
                    />
                </>
            )}

            {showUpdateModal && selectedJob && (
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
                                <form onSubmit={handleUpdateJob}>
                                    <div className="modal-header">
                                        <h5 className="modal-title fw-bold">
                                            Update Job
                                        </h5>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={closeUpdateModal}
                                            disabled={updatingJob}
                                            aria-label="Close"
                                        />
                                    </div>

                                    <div className="modal-body">
                                        {updateError && (
                                            <div
                                                className="alert alert-danger"
                                                role="alert"
                                            >
                                                {updateError}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label
                                                htmlFor="updateJobTitle"
                                                className="form-label"
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
                                                className="form-label"
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
                                                className="form-label"
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
                                            <div className="col-12 col-md-6 mb-3">
                                                <label
                                                    htmlFor="updateJobBudget"
                                                    className="form-label"
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

                                            <div className="col-12 col-md-6 mb-3">
                                                <label
                                                    htmlFor="updateJobDeadline"
                                                    className="form-label"
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
                                                className="form-label"
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

                                    <div className="modal-footer">
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
                                            className="btn btn-primary"
                                            disabled={updatingJob}
                                        >
                                            {updatingJob
                                                ? 'Updating...'
                                                : 'Update Job'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div
                        className="modal-backdrop fade show"
                        style={{ zIndex: 1040 }}
                        onClick={closeUpdateModal}
                    />
                </>
            )}
        </div>
    )
}

export default MyJobs


