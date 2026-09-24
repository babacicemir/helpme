import { useEffect, useState } from 'react'
import {
    getAllReports,
    blockUser
} from '../../services/adminService'

function AdminReports() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [selectedReport, setSelectedReport] = useState(null)
    const [blockLoading, setBlockLoading] = useState(false)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getAllReports()

                setReports(response.data)
            } catch (error) {
                console.error(
                    'GET REPORTS ERROR:',
                    error
                )

                setError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Failed to load reports'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    const handleBlockUser = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to block user "${selectedReport.reported_username}"?`
        )

        if (!confirmed) {
            return
        }

        try {
            setBlockLoading(true)
            setError('')
            setSuccess('')

            await blockUser(
                selectedReport.reported_user_id
            )

            setSuccess(
                `User "${selectedReport.reported_username}" has been blocked successfully.`
            )

            setSelectedReport(null)
        } catch (error) {
            console.error(
                'BLOCK USER ERROR:',
                error
            )

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to block user'
            )
        } finally {
            setBlockLoading(false)
        }
    }

    return (
        <div className="container py-4">

            <div className="mb-4">
                <h1 className="fw-bold">
                    Reports
                </h1>

                <p className="text-muted mb-0">
                    Review reports submitted by HelpMe.ba users
                </p>
            </div>

            {loading && (
                <div className="alert alert-info text-center">
                    Loading reports...
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

            {!loading &&
                !error &&
                reports.length === 0 && (
                    <div className="alert alert-info text-center">
                        There are currently no reports.
                    </div>
                )}

            {!loading &&
                !error &&
                reports.length > 0 && (
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Reporter</th>
                                            <th>Reported User</th>
                                            <th>Reason</th>
                                            <th>Target</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {reports.map((report) => (
                                            <tr
                                                key={
                                                    report.report_id
                                                }
                                            >
                                                <td>
                                                    {
                                                        report.reporter_username
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        report.reported_username
                                                    }
                                                </td>

                                                <td>
                                                    {report.reason}
                                                </td>

                                                <td>
                                                    {report.reported_job_id
                                                        ? `Job: ${report.job_title}`
                                                        : report.reported_service_id
                                                            ? `Service: ${report.service_title}`
                                                            : 'User'}
                                                </td>

                                                <td>
                                                    {report.status}
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() =>
                                                            setSelectedReport(
                                                                report
                                                            )
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

            {selectedReport && (
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
                                        Report Details
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            setSelectedReport(null)
                                        }
                                        disabled={blockLoading}
                                    />
                                </div>

                                <div className="modal-body">

                                    <div className="mb-3">
                                        <strong>
                                            Reporter:
                                        </strong>{' '}
                                        {
                                            selectedReport.reporter_username
                                        }
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Reported User:
                                        </strong>{' '}
                                        {
                                            selectedReport.reported_username
                                        }
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Reason:
                                        </strong>{' '}
                                        {selectedReport.reason}
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Description:
                                        </strong>

                                        <div className="mt-1">
                                            {
                                                selectedReport.description ||
                                                'No description'
                                            }
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Reported Job:
                                        </strong>{' '}

                                        {selectedReport.reported_job_id
                                            ? selectedReport.job_title
                                            : 'None'}
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Reported Service:
                                        </strong>{' '}

                                        {selectedReport.reported_service_id
                                            ? selectedReport.service_title
                                            : 'None'}
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Evidence:
                                        </strong>

                                        <div className="mt-1">
                                            {selectedReport.evidence_image
                                                ? (
                                                    <a
                                                        href={
                                                            selectedReport.evidence_image
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        View evidence
                                                    </a>
                                                )
                                                : 'No evidence provided'}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Status:
                                        </strong>{' '}
                                        {selectedReport.status}
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Action:
                                        </strong>{' '}
                                        {selectedReport.action ||
                                            'No action'}
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Created:
                                        </strong>{' '}

                                        {selectedReport.created_at
                                            ? new Date(
                                                selectedReport.created_at
                                            ).toLocaleString()
                                            : 'Unknown'}
                                    </div>

                                    <div>
                                        <strong>
                                            Updated:
                                        </strong>{' '}

                                        {selectedReport.updated_at
                                            ? new Date(
                                                selectedReport.updated_at
                                            ).toLocaleString()
                                            : 'Unknown'}
                                    </div>

                                </div>

                                <div className="modal-footer">

                                    {selectedReport.reported_user_id && (
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={
                                                handleBlockUser
                                            }
                                            disabled={
                                                blockLoading
                                            }
                                        >
                                            {blockLoading
                                                ? 'Blocking...'
                                                : 'Block User'}
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setSelectedReport(
                                                null
                                            )
                                        }
                                        disabled={blockLoading}
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

export default AdminReports