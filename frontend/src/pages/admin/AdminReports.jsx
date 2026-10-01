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
                console.error('GET REPORTS ERROR:', error)

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
                selectedReport.reported_user_id,
                selectedReport.reason_id,
                selectedReport.description
            )

            setSuccess(
                `User "${selectedReport.reported_username}" has been blocked successfully.`
            )

            setSelectedReport(null)
        } catch (error) {
            console.error('BLOCK USER ERROR:', error)

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to block user'
            )
        } finally {
            setBlockLoading(false)
        }
    }

    const getStatusClass = (status) => {
        if (status === 'RESOLVED') {
            return 'bg-success bg-opacity-10 text-success'
        }

        if (status === 'IN_PROGRESS') {
            return 'bg-primary bg-opacity-10 text-primary'
        }

        if (status === 'PENDING') {
            return 'bg-warning bg-opacity-10 text-warning'
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
                                Reports
                            </h1>

                            <p className="text-muted mb-0">
                                Review reports submitted by HelpMe.ba users
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
                                    <i className="bi bi-flag fs-5" />
                                </div>

                                <div>
                                    <small className="text-muted d-block">
                                        Total Reports
                                    </small>

                                    <span className="fw-bold fs-5">
                                        {reports.length}
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
                                Loading reports...
                            </p>

                        </div>
                    </div>
                )}

                {!loading && !error && reports.length === 0 && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">

                            <div
                                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{
                                    width: '64px',
                                    height: '64px'
                                }}
                            >
                                <i className="bi bi-flag fs-3" />
                            </div>

                            <h5 className="fw-bold">
                                No Reports Found
                            </h5>

                            <p className="text-muted mb-0">
                                There are currently no reports submitted
                                by users.
                            </p>

                        </div>
                    </div>
                )}

                {!loading && !error && reports.length > 0 && (
                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-0">

                            <div className="px-4 py-3 border-bottom">

                                <h5 className="fw-bold mb-1">
                                    Submitted Reports
                                </h5>

                                <p className="text-muted small mb-0">
                                    Review and manage reports submitted by users
                                </p>

                            </div>

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">

                                        <tr>

                                            <th className="px-4">
                                                Reporter
                                            </th>

                                            <th>
                                                Reported User
                                            </th>

                                            <th>
                                                Reason
                                            </th>

                                            <th>
                                                Target
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

                                        {reports.map((report) => (

                                            <tr key={report.report_id}>

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

                                                        <span className="fw-semibold">
                                                            {report.reporter_username}
                                                        </span>

                                                    </div>

                                                </td>

                                                <td>

                                                    <span className="fw-semibold">
                                                        {report.reported_username}
                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="text-secondary">
                                                        {report.reason}
                                                    </span>

                                                </td>

                                                <td>

                                                    {report.reported_job_id ? (
                                                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                                            <i className="bi bi-briefcase me-1" />
                                                            Job
                                                        </span>
                                                    ) : report.reported_service_id ? (
                                                        <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                                                            <i className="bi bi-tools me-1" />
                                                            Service
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                                                            <i className="bi bi-person me-1" />
                                                            User
                                                        </span>
                                                    )}

                                                </td>

                                                <td>

                                                    <span
                                                        className={`badge px-3 py-2 ${getStatusClass(
                                                            report.status
                                                        )}`}
                                                    >
                                                        {report.status}
                                                    </span>

                                                </td>

                                                <td className="text-end px-4">

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary px-3"
                                                        onClick={() =>
                                                            setSelectedReport(
                                                                report
                                                            )
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

            {selectedReport && (
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
                                            <i className="bi bi-flag fs-5" />
                                        </div>

                                        <div>

                                            <h5 className="modal-title fw-bold mb-0">
                                                Report Details
                                            </h5>

                                            <small className="text-muted">
                                                Report #{selectedReport.report_id}
                                            </small>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            setSelectedReport(null)
                                        }
                                        disabled={blockLoading}
                                        aria-label="Close"
                                    />

                                </div>

                                <div className="modal-body px-4 py-4">

                                    <div className="row g-3 mb-4">

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Reporter
                                                </small>

                                                <span className="fw-semibold">
                                                    <i className="bi bi-person me-2 text-primary" />
                                                    {selectedReport.reporter_username}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Reported User
                                                </small>

                                                <span className="fw-semibold">
                                                    <i className="bi bi-person-fill me-2 text-danger" />
                                                    {selectedReport.reported_username}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Reason
                                                </small>

                                                <span className="fw-medium">
                                                    {selectedReport.reason}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Status
                                                </small>

                                                <span
                                                    className={`badge px-3 py-2 ${getStatusClass(
                                                        selectedReport.status
                                                    )}`}
                                                >
                                                    {selectedReport.status}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="bg-light rounded-3 p-3 mb-4">

                                        <small className="text-muted d-block mb-2">
                                            Description
                                        </small>

                                        <p className="mb-0 text-secondary">
                                            {selectedReport.description ||
                                                'No description provided'}
                                        </p>

                                    </div>

                                    <div className="row g-3">

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Reported Job
                                                </small>

                                                <span className="fw-medium">

                                                    {selectedReport.reported_job_id
                                                        ? (
                                                            <>
                                                                <i className="bi bi-briefcase me-2 text-primary" />
                                                                {selectedReport.job_title}
                                                            </>
                                                        )
                                                        : 'None'}

                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Reported Service
                                                </small>

                                                <span className="fw-medium">

                                                    {selectedReport.reported_service_id
                                                        ? (
                                                            <>
                                                                <i className="bi bi-tools me-2 text-primary" />
                                                                {selectedReport.service_title}
                                                            </>
                                                        )
                                                        : 'None'}

                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Action
                                                </small>

                                                <span className="fw-medium">
                                                    {selectedReport.action ||
                                                        'No action'}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Evidence
                                                </small>

                                                {selectedReport.evidence_image ? (
                                                    <a
                                                        href={
                                                            selectedReport.evidence_image
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-decoration-none"
                                                    >
                                                        <i className="bi bi-image me-2" />
                                                        View evidence
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">
                                                        No evidence provided
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Created
                                                </small>

                                                <span className="fw-medium">
                                                    {selectedReport.created_at
                                                        ? new Date(
                                                            selectedReport.created_at
                                                        ).toLocaleString()
                                                        : 'Unknown'}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-md-6">

                                            <div className="bg-light rounded-3 p-3 h-100">

                                                <small className="text-muted d-block mb-1">
                                                    Last Updated
                                                </small>

                                                <span className="fw-medium">
                                                    {selectedReport.updated_at
                                                        ? new Date(
                                                            selectedReport.updated_at
                                                        ).toLocaleString()
                                                        : 'Unknown'}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="modal-footer px-4 py-3">

                                    {selectedReport.reported_user_id && (
                                        <button
                                            type="button"
                                            className="btn btn-danger px-3"
                                            onClick={handleBlockUser}
                                            disabled={blockLoading}
                                        >
                                            <i className="bi bi-person-fill-slash me-1" />

                                            {blockLoading
                                                ? 'Blocking...'
                                                : 'Block User'}
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn-secondary px-3"
                                        onClick={() =>
                                            setSelectedReport(null)
                                        }
                                        disabled={blockLoading}
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

export default AdminReports

