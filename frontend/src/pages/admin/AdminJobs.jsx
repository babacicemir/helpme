import { useEffect, useState } from 'react'
import { getAllJobs, deleteJob } from '../../services/adminService'

function AdminJobs() {
const [jobs, setJobs] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
const [selectedJob, setSelectedJob] = useState(null)
const [deleteLoading, setDeleteLoading] = useState(false)

useEffect(() => {
    const fetchJobs = async () => {
        try {
            const response = await getAllJobs()

            setJobs(response.data)
        } catch (error) {
            console.error('GET JOBS ERROR:', error)

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to load jobs'
            )
        } finally {
            setLoading(false)
        }
    }

    fetchJobs()
}, [])

const handleDeleteJob = async () => {
    const confirmed = window.confirm(
        `Are you sure you want to delete job "${selectedJob.title}"?`
    )

    if (!confirmed) {
        return
    }

    try {
        setDeleteLoading(true)
        setError('')
        setSuccess('')

        await deleteJob(selectedJob.job_id)

        setJobs((currentJobs) =>
            currentJobs.filter(
                (job) => job.job_id !== selectedJob.job_id
            )
        )

        setSelectedJob(null)

        setSuccess('Job deleted successfully.')
    } catch (error) {
        console.error('DELETE JOB ERROR:', error)

        setError(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to delete job'
        )
    } finally {
        setDeleteLoading(false)
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

return (
    <div className="container-fluid bg-light min-vh-100 py-5">

        <div className="container">

            <div className="mb-5">

                <p className="text-primary fw-semibold mb-2">
                    Administration
                </p>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">

                    <div>
                        <h1 className="fw-bold mb-2">
                            Jobs
                        </h1>

                        <p className="text-muted mb-0">
                            Manage jobs posted on HelpMe.ba
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

                </div>

            </div>

            {success && (
                <div className="alert alert-success border-0 shadow-sm d-flex align-items-center mb-4">
                    <i className="bi bi-check-circle-fill me-2" />
                    {success}
                </div>
            )}

            {error && (
                <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center mb-4">
                    <i className="bi bi-exclamation-circle-fill me-2" />
                    {error}
                </div>
            )}

            {loading && (
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
            )}

            {!loading && !error && jobs.length === 0 && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">

                        <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{
                                width: '64px',
                                height: '64px'
                            }}
                        >
                            <i className="bi bi-briefcase fs-3" />
                        </div>

                        <h5 className="fw-bold">
                            No Jobs Found
                        </h5>

                        <p className="text-muted mb-0">
                            There are currently no jobs posted
                            on HelpMe.ba.
                        </p>

                    </div>
                </div>
            )}

            {!loading && !error && jobs.length > 0 && (
                <div className="card border-0 shadow-sm">

                    <div className="card-body p-0">

                        <div className="px-4 py-3 border-bottom">

                            <h5 className="fw-bold mb-1">
                                Posted Jobs
                            </h5>

                            <p className="text-muted small mb-0">
                                View and manage all jobs posted by users
                            </p>

                        </div>

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th className="px-4">
                                            Posted By
                                        </th>

                                        <th>
                                            Job
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th className="text-end px-4">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {jobs.map((job) => (

                                        <tr key={job.job_id}>

                                            <td className="px-4">

                                                <div className="d-flex align-items-center">

                                                    <div
                                                        className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                        style={{
                                                            width: '42px',
                                                            height: '42px'
                                                        }}
                                                    >
                                                        <i className="bi bi-person fs-5" />
                                                    </div>

                                                    <div>
                                                        <span className="fw-semibold">
                                                            {job.username}
                                                        </span>
                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <div
                                                    className="fw-semibold text-dark"
                                                    style={{
                                                        maxWidth: '280px'
                                                    }}
                                                >
                                                    {job.title}
                                                </div>

                                            </td>

                                            <td>

                                                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                                    {job.category}
                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={`badge px-3 py-2 ${getStatusClass(
                                                        job.status
                                                    )}`}
                                                >
                                                    {job.status}
                                                </span>

                                            </td>

                                            <td className="text-end px-4">

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary px-3"
                                                    onClick={() =>
                                                        setSelectedJob(job)
                                                    }
                                                >
                                                    <i className="bi bi-eye me-1" />
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

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
                >

                    <div className="modal-dialog modal-dialog-centered modal-lg">

                        <div className="modal-content border-0 shadow-lg">

                            <div className="modal-header px-4 py-3">

                                <div className="d-flex align-items-center">

                                    <div
                                        className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-3"
                                        style={{
                                            width: '44px',
                                            height: '44px'
                                        }}
                                    >
                                        <i className="bi bi-briefcase fs-5" />
                                    </div>

                                    <div>

                                        <h5 className="modal-title fw-bold mb-0">
                                            Job Details
                                        </h5>

                                        <small className="text-muted">
                                            Posted by @{selectedJob.username}
                                        </small>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setSelectedJob(null)
                                    }
                                    disabled={deleteLoading}
                                    aria-label="Close"
                                />

                            </div>

                            <div className="modal-body px-4 py-4">

                                <div className="mb-4">

                                    <h4 className="fw-bold mb-2">
                                        {selectedJob.title}
                                    </h4>

                                    <div className="d-flex flex-wrap gap-2">

                                        <span className="badge bg-primary px-3 py-2">
                                            {selectedJob.category}
                                        </span>

                                        <span
                                            className={`badge px-3 py-2 ${getStatusClass(
                                                selectedJob.status
                                            )}`}
                                        >
                                            {selectedJob.status}
                                        </span>

                                    </div>

                                </div>

                                <div className="bg-light rounded-3 p-3 mb-4">

                                    <small className="text-muted d-block mb-2">
                                        Description
                                    </small>

                                    <p className="mb-0 text-secondary">
                                        {selectedJob.job_description}
                                    </p>

                                </div>

                                <div className="row g-3">

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Posted By
                                            </small>

                                            <span className="fw-medium">
                                                <i className="bi bi-person me-2 text-primary" />
                                                {selectedJob.username}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Budget
                                            </small>

                                            <span className="fw-bold text-primary">
                                                {selectedJob.budget} KM
                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Deadline
                                            </small>

                                            <span className="fw-medium">

                                                <i className="bi bi-calendar-event me-2 text-primary" />

                                                {selectedJob.deadline
                                                    ? new Date(
                                                        selectedJob.deadline
                                                    ).toLocaleDateString()
                                                    : 'No deadline'}

                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Location
                                            </small>

                                            <span className="fw-medium">

                                                <i className="bi bi-geo-alt me-2 text-primary" />

                                                {selectedJob.job_location ||
                                                    'Not specified'}

                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Created
                                            </small>

                                            <span className="fw-medium">
                                                {new Date(
                                                    selectedJob.job_created_at
                                                ).toLocaleDateString()}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Last Updated
                                            </small>

                                            <span className="fw-medium">
                                                {new Date(
                                                    selectedJob.job_updated_at
                                                ).toLocaleDateString()}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="modal-footer px-4 py-3">

                                <button
                                    type="button"
                                    className="btn btn-danger px-3"
                                    onClick={handleDeleteJob}
                                    disabled={deleteLoading}
                                >
                                    <i className="bi bi-trash me-1" />

                                    {deleteLoading
                                        ? 'Deleting...'
                                        : 'Delete'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary px-3"
                                    onClick={() =>
                                        setSelectedJob(null)
                                    }
                                    disabled={deleteLoading}
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
                />

            </>
        )}

    </div>
)

}

export default AdminJobs
