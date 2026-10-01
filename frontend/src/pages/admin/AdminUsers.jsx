import { useEffect, useState } from 'react'
import { getAllUsers, blockUser, unblockUser, deleteUser } from '../../services/adminService'

function AdminUsers() {
const [users, setUsers] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
const [selectedUser, setSelectedUser] = useState(null)
const [actionLoading, setActionLoading] = useState(false)
const [deleteLoading, setDeleteLoading] = useState(false)

useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await getAllUsers()

            setUsers(response.data)
        } catch (error) {
            console.error('GET USERS ERROR:', error)

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to load users'
            )
        } finally {
            setLoading(false)
        }
    }

    fetchUsers()
}, [])

const handleBlockToggle = async () => {
    try {
        setActionLoading(true)
        setError('')
        setSuccess('')

        if (selectedUser.is_blocked) {
            await unblockUser(selectedUser.id)
        } else {
            await blockUser(selectedUser.id)
        }

        const updatedUser = {
            ...selectedUser,
            is_blocked: !selectedUser.is_blocked
        }

        setSelectedUser(updatedUser)

        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user.id === updatedUser.id
                    ? updatedUser
                    : user
            )
        )

        setSuccess(
            updatedUser.is_blocked
                ? 'User blocked successfully.'
                : 'User unblocked successfully.'
        )
    } catch (error) {
        console.error('BLOCK USER ERROR:', error)

        setError(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to update user status'
        )
    } finally {
        setActionLoading(false)
    }
}

const handleDeleteUser = async () => {
    const confirmed = window.confirm(
        `Are you sure you want to delete user "${selectedUser.username}"?`
    )

    if (!confirmed) {
        return
    }

    try {
        setDeleteLoading(true)
        setError('')
        setSuccess('')

        await deleteUser(selectedUser.id)

        setUsers((currentUsers) =>
            currentUsers.filter(
                (user) => user.id !== selectedUser.id
            )
        )

        setSelectedUser(null)

        setSuccess('User deleted successfully.')
    } catch (error) {
        console.error('DELETE USER ERROR:', error)

        setError(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to delete user'
        )
    } finally {
        setDeleteLoading(false)
    }
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
                            Users
                        </h1>

                        <p className="text-muted mb-0">
                            Manage registered users on HelpMe.ba
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
                                <i className="bi bi-people fs-5" />
                            </div>

                            <div>
                                <small className="text-muted d-block">
                                    Total Users
                                </small>

                                <span className="fw-bold fs-5">
                                    {users.length}
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
                            Loading users...
                        </p>

                    </div>
                </div>
            )}

            {!loading && !error && users.length === 0 && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">

                        <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{
                                width: '64px',
                                height: '64px'
                            }}
                        >
                            <i className="bi bi-people fs-3" />
                        </div>

                        <h5 className="fw-bold">
                            No Users Found
                        </h5>

                        <p className="text-muted mb-0">
                            There are currently no users registered
                            on HelpMe.ba.
                        </p>

                    </div>
                </div>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="card border-0 shadow-sm">

                    <div className="card-body p-0">

                        <div className="px-4 py-3 border-bottom">
                            <h5 className="fw-bold mb-1">
                                Registered Users
                            </h5>

                            <p className="text-muted small mb-0">
                                View and manage all registered users
                            </p>
                        </div>

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>
                                        <th className="px-4 py-3">
                                            User
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Location
                                        </th>

                                        <th>
                                            Role
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                        <th className="text-end px-4">
                                            Actions
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {users.map((user) => (

                                        <tr key={user.id}>

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
                                                        <div className="fw-semibold">
                                                            {user.first_name}{' '}
                                                            {user.last_name}
                                                        </div>

                                                        <small className="text-muted">
                                                            @{user.username}
                                                        </small>
                                                    </div>

                                                </div>

                                            </td>

                                            <td>
                                                <span className="text-muted">
                                                    {user.email}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="text-muted">
                                                    {user.location}
                                                </span>
                                            </td>

                                            <td>

                                                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                                    {user.role}
                                                </span>

                                            </td>

                                            <td>

                                                {user.is_blocked ? (
                                                    <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">
                                                        <i className="bi bi-lock-fill me-1" />
                                                        Blocked
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                                                        <i className="bi bi-check-circle-fill me-1" />
                                                        Active
                                                    </span>
                                                )}

                                            </td>

                                            <td>
                                                <span className="text-muted">
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </td>

                                            <td className="text-end px-4">

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary px-3"
                                                    onClick={() =>
                                                        setSelectedUser(user)
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

        {selectedUser && (
            <>

                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                >

                    <div className="modal-dialog modal-dialog-centered">

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
                                        <i className="bi bi-person fs-5" />
                                    </div>

                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">
                                            User Details
                                        </h5>

                                        <small className="text-muted">
                                            @{selectedUser.username}
                                        </small>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setSelectedUser(null)
                                    }
                                    disabled={
                                        actionLoading ||
                                        deleteLoading
                                    }
                                    aria-label="Close"
                                />

                            </div>

                            <div className="modal-body px-4 py-4">

                                <div className="text-center mb-4">

                                    <div
                                        className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{
                                            width: '72px',
                                            height: '72px'
                                        }}
                                    >
                                        <i className="bi bi-person-fill fs-2" />
                                    </div>

                                    <h5 className="fw-bold mb-1">
                                        {selectedUser.first_name}{' '}
                                        {selectedUser.last_name}
                                    </h5>

                                    <p className="text-muted mb-0">
                                        @{selectedUser.username}
                                    </p>

                                </div>

                                <div className="row g-3">

                                    <div className="col-12">

                                        <div className="bg-light rounded-3 p-3">
                                            <small className="text-muted d-block mb-1">
                                                Email
                                            </small>

                                            <span className="fw-medium">
                                                {selectedUser.email}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">
                                            <small className="text-muted d-block mb-1">
                                                Location
                                            </small>

                                            <span className="fw-medium">
                                                {selectedUser.location}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">
                                            <small className="text-muted d-block mb-1">
                                                Role
                                            </small>

                                            <span className="badge bg-primary">
                                                {selectedUser.role}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Status
                                            </small>

                                            {selectedUser.is_blocked ? (
                                                <span className="badge bg-danger">
                                                    Blocked
                                                </span>
                                            ) : (
                                                <span className="badge bg-success">
                                                    Active
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="bg-light rounded-3 p-3 h-100">

                                            <small className="text-muted d-block mb-1">
                                                Registered
                                            </small>

                                            <span className="fw-medium">
                                                {new Date(
                                                    selectedUser.created_at
                                                ).toLocaleDateString()}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-12">

                                        <div className="bg-light rounded-3 p-3">

                                            <small className="text-muted d-block mb-1">
                                                Bio
                                            </small>

                                            <span className="text-secondary">
                                                {selectedUser.bio ||
                                                    'No bio provided'}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="modal-footer px-4 py-3">

                                <button
                                    type="button"
                                    className={
                                        selectedUser.is_blocked
                                            ? 'btn btn-success px-3'
                                            : 'btn btn-warning px-3'
                                    }
                                    onClick={handleBlockToggle}
                                    disabled={
                                        actionLoading ||
                                        deleteLoading
                                    }
                                >
                                    <i
                                        className={
                                            selectedUser.is_blocked
                                                ? 'bi bi-unlock me-1'
                                                : 'bi bi-lock me-1'
                                        }
                                    />

                                    {actionLoading
                                        ? 'Please wait...'
                                        : selectedUser.is_blocked
                                            ? 'Unblock'
                                            : 'Block'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger px-3"
                                    onClick={handleDeleteUser}
                                    disabled={
                                        actionLoading ||
                                        deleteLoading
                                    }
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
                                        setSelectedUser(null)
                                    }
                                    disabled={
                                        actionLoading ||
                                        deleteLoading
                                    }
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

export default AdminUsers
