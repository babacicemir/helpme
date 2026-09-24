import { useEffect, useState } from 'react'
import {
    getAllJobs,
    deleteJob
} from '../../services/adminService'

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

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h1 className="fw-bold">
                    Jobs
                </h1>

                <p className="text-muted mb-0">
                    Manage jobs posted on HelpMe.ba
                </p>
            </div>

            {loading && (
                <div className="alert alert-info text-center">
                    Loading jobs...
                </div>
            )}

            {success && (
                <div className="alert alert-success text-center">
                    {success}
                </div>
            )}

            {error && (
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            )}

            {!loading && !error && jobs.length === 0 && (
                <div className="alert alert-info text-center">
                    There are currently no jobs posted on HelpMe.ba.
                </div>
            )}

            {!loading && !error && jobs.length > 0 && (
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.job_id}>
                                            <td>
                                                {job.username}
                                            </td>

                                            <td>
                                                {job.title}
                                            </td>

                                            <td>
                                                {job.category}
                                            </td>

                                            <td>
                                                {job.status}
                                            </td>

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        setSelectedJob(job)
                                                    }
                                                >
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

            {selectedJob && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Job Details
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            setSelectedJob(null)
                                        }
                                        disabled={deleteLoading}
                                    />
                                </div>

                                <div className="modal-body">
                                    <div className="mb-3">
                                        <strong>Title:</strong>{' '}
                                        {selectedJob.title}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Posted by:</strong>{' '}
                                        {selectedJob.username}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Category:</strong>{' '}
                                        {selectedJob.category}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Description:</strong>
                                        <div className="mt-1">
                                            {selectedJob.job_description}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <strong>Budget:</strong>{' '}
                                        {selectedJob.budget} KM
                                    </div>

                                    <div className="mb-3">
                                        <strong>Deadline:</strong>{' '}
                                        {selectedJob.deadline
                                            ? new Date(
                                                selectedJob.deadline
                                            ).toLocaleDateString()
                                            : 'No deadline'}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Location:</strong>{' '}
                                        {selectedJob.job_location ||
                                            'Not specified'}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Status:</strong>{' '}
                                        {selectedJob.status}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Created:</strong>{' '}
                                        {new Date(
                                            selectedJob.job_created_at
                                        ).toLocaleDateString()}
                                    </div>

                                    <div>
                                        <strong>Updated:</strong>{' '}
                                        {new Date(
                                            selectedJob.job_updated_at
                                        ).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDeleteJob}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
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

                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    )
}

export default AdminJobs