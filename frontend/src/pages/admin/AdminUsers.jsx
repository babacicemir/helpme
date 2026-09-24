import { useEffect, useState } from 'react'
import {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser
} from '../../services/adminService'

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
        <div className="container py-4">
            <div className="mb-4">
                <h1 className="fw-bold">
                    Users
                </h1>

                <p className="text-muted mb-0">
                    Manage registered users on HelpMe.ba
                </p>
            </div>

            {loading && (
                <div className="alert alert-info text-center">
                    Loading users...
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

            {!loading && !error && users.length === 0 && (
                <div className="alert alert-info text-center">
                    There are currently no users registered on HelpMe.ba.
                </div>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Location</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                {user.username}
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                {user.location}
                                            </td>

                                            <td>
                                                {user.role}
                                            </td>

                                            <td>
                                                {user.is_blocked
                                                    ? 'Blocked'
                                                    : 'Active'}
                                            </td>

                                            <td>
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString()}
                                            </td>

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        setSelectedUser(user)
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

            {selectedUser && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        User Details
                                    </h5>

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
                                    />
                                </div>

                                <div className="modal-body">
                                    <div className="mb-3">
                                        <strong>Name:</strong>{' '}
                                        {selectedUser.first_name}{' '}
                                        {selectedUser.last_name}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Username:</strong>{' '}
                                        {selectedUser.username}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Email:</strong>{' '}
                                        {selectedUser.email}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Location:</strong>{' '}
                                        {selectedUser.location}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Role:</strong>{' '}
                                        {selectedUser.role}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Status:</strong>{' '}
                                        {selectedUser.is_blocked
                                            ? 'Blocked'
                                            : 'Active'}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Bio:</strong>{' '}
                                        {selectedUser.bio ||
                                            'No bio provided'}
                                    </div>

                                    <div>
                                        <strong>Registered:</strong>{' '}
                                        {new Date(
                                            selectedUser.created_at
                                        ).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className={
                                            selectedUser.is_blocked
                                                ? 'btn btn-success'
                                                : 'btn btn-warning'
                                        }
                                        onClick={handleBlockToggle}
                                        disabled={
                                            actionLoading ||
                                            deleteLoading
                                        }
                                    >
                                        {actionLoading
                                            ? 'Please wait...'
                                            : selectedUser.is_blocked
                                                ? 'Unblock'
                                                : 'Block'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDeleteUser}
                                        disabled={
                                            actionLoading ||
                                            deleteLoading
                                        }
                                    >
                                        {deleteLoading
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
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

                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    )
}

export default AdminUsers