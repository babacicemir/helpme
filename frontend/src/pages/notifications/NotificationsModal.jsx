import { useEffect, useState } from 'react'
import {
    getNotifications,
    getUnseenNotifications,
    markNotificationAsSeen,
    markAllNotificationsAsSeen
} from '../../services/userService'

function NotificationsModal({ onClose }) {
    const [notifications, setNotifications] = useState([])
    const [unseenCount, setUnseenCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [markingAll, setMarkingAll] = useState(false)

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true)
                setError('')

                const [notificationsResponse, unseenResponse] =
                    await Promise.all([
                        getNotifications(),
                        getUnseenNotifications()
                    ])

                setNotifications(notificationsResponse.data || [])
                setUnseenCount(
                    unseenResponse.data?.length ||
                        unseenResponse.data?.count ||
                        0
                )
            } catch (error) {
                console.error('Error loading notifications:', error)

                setError(
                    error.response?.data?.message ||
                        'Failed to load notifications.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadNotifications()
    }, [])

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'OFFER_RECEIVED':
                return 'bi bi-cash-coin'

            case 'OFFER_ACCEPTED':
                return 'bi bi-check-circle'

            case 'OFFER_REJECTED':
                return 'bi bi-x-circle'

            case 'MESSAGE_RECEIVED':
                return 'bi bi-chat-dots'

            case 'MESSAGE_REPLY':
                return 'bi bi-reply'

            case 'JOB_CREATED':
                return 'bi bi-plus-circle'

            case 'JOB_UPDATED':
                return 'bi bi-pencil-square'

            case 'JOB_DELETED':
                return 'bi bi-trash'

            case 'REPORT_CREATED':
                return 'bi bi-flag'

            case 'REPORT_RESOLVED':
                return 'bi bi-check2-square'

            case 'ACCOUNT_BLOCKED':
                return 'bi bi-person-x'

            case 'ACCOUNT_UNBLOCKED':
                return 'bi bi-person-check'

            default:
                return 'bi bi-bell'
        }
    }

    const getNotificationIconClass = (type) => {
        switch (type) {
            case 'OFFER_ACCEPTED':
            case 'ACCOUNT_UNBLOCKED':
            case 'REPORT_RESOLVED':
                return 'text-success'

            case 'OFFER_REJECTED':
            case 'JOB_DELETED':
            case 'ACCOUNT_BLOCKED':
                return 'text-danger'

            case 'OFFER_RECEIVED':
            case 'MESSAGE_RECEIVED':
            case 'MESSAGE_REPLY':
                return 'text-primary'

            case 'REPORT_CREATED':
                return 'text-warning'

            default:
                return 'text-secondary'
        }
    }

    const handleMarkAsSeen = async (notificationId) => {
        try {
            await markNotificationAsSeen(notificationId)

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification.id === notificationId
                        ? {
                              ...notification,
                              is_seen: true
                          }
                        : notification
                )
            )

            setUnseenCount((currentCount) =>
                currentCount > 0 ? currentCount - 1 : 0
            )
        } catch (error) {
            console.error(
                'Error marking notification as seen:',
                error
            )
        }
    }

    const handleMarkAllAsSeen = async () => {
        try {
            setMarkingAll(true)

            await markAllNotificationsAsSeen()

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) => ({
                    ...notification,
                    is_seen: true
                }))
            )

            setUnseenCount(0)
        } catch (error) {
            console.error(
                'Error marking all notifications as seen:',
                error
            )
        } finally {
            setMarkingAll(false)
        }
    }

    const formatNotificationDate = (date) => {
        return new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
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
                            <div>
                                <h5 className="modal-title fw-bold mb-1">
                                    Notifications
                                </h5>

                                {!loading && !error && (
                                    <small className="text-muted">
                                        {unseenCount > 0
                                            ? `${unseenCount} unread notification${
                                                  unseenCount !== 1
                                                      ? 's'
                                                      : ''
                                              }`
                                            : 'All notifications are seen'}
                                    </small>
                                )}
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            />
                        </div>

                        <div className="modal-body p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div
                                        className="spinner-border text-primary"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>

                                    <p className="text-muted mt-3 mb-0">
                                        Loading notifications...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="p-4">
                                    <div className="alert alert-danger mb-0">
                                        {error}
                                    </div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center py-5 px-4">
                                    <i className="bi bi-bell-slash fs-1 text-muted" />

                                    <h5 className="fw-bold mt-3">
                                        No notifications
                                    </h5>

                                    <p className="text-muted mb-0">
                                        You don't have any notifications yet.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-3 border-bottom ${
                                                !notification.is_seen
                                                    ? 'bg-light'
                                                    : ''
                                            }`}
                                        >
                                            <div className="d-flex gap-3">
                                                <div className="pt-1">
                                                    <i
                                                        className={`${getNotificationIcon(
                                                            notification.type
                                                        )} fs-4 ${getNotificationIconClass(
                                                            notification.type
                                                        )}`}
                                                    />
                                                </div>

                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-start gap-3">
                                                        <div>
                                                            <h6 className="fw-bold mb-1">
                                                                {
                                                                    notification.title
                                                                }
                                                            </h6>

                                                            <p className="mb-1 text-muted">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>

                                                            <small className="text-muted">
                                                                {formatNotificationDate(
                                                                    notification.created_at
                                                                )}
                                                            </small>
                                                        </div>

                                                        {!notification.is_seen && (
                                                            <span className="badge bg-primary">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>

                                                    {!notification.is_seen && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary mt-2"
                                                            onClick={() =>
                                                                handleMarkAsSeen(
                                                                    notification.id
                                                                )
                                                            }
                                                        >
                                                            Mark as seen
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!loading &&
                            !error &&
                            notifications.length > 0 && (
                                <div className="modal-footer d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={handleMarkAllAsSeen}
                                        disabled={
                                            unseenCount === 0 || markingAll
                                        }
                                    >
                                        {markingAll
                                            ? 'Marking...'
                                            : 'Mark all as seen'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            )}

                        {(loading || error || notifications.length === 0) && (
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1040 }}
                onClick={onClose}
            />
        </>
    )
}

export default NotificationsModal