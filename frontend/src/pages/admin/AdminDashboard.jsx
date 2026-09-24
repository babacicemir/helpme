import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    getDashboardStats,
    getRecentActivity
} from '../../services/adminService'

function AdminDashboard() {

    const navigate = useNavigate()

    const [stats, setStats] = useState(null)
    const [recentActivity, setRecentActivity] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [statsResponse, activityResponse] =
                    await Promise.all([
                        getDashboardStats(),
                        getRecentActivity()
                    ])

                setStats(statsResponse.data)
                setRecentActivity(activityResponse.data)
            } catch (error) {
                console.error('DASHBOARD ERROR:', error)
                setError('Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }

        loadDashboardData()
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

        return `${diffInDays} ${
            diffInDays === 1 ? 'day' : 'days'
        } ago`
    }

    const dashboardStats = [
        {
            title: 'Total Users',
            value: stats?.totalUsers ?? 0,
            description: 'Registered users'
        },
        {
            title: 'Blocked Users',
            value: stats?.blockedUsers ?? 0,
            description: 'Currently blocked'
        },
        {
            title: 'Total Jobs',
            value: stats?.totalJobs ?? 0,
            description: 'Jobs posted'
        },
        {
            title: 'Total Categories',
            value: stats?.totalCategories ?? 0,
            description: 'Available categories'
        },
        {
            title: 'Total Reports',
            value: stats?.totalReports ?? 0,
            description: 'All submitted reports'
        },
        {
            title: 'Resolved Reports',
            value: stats?.resolvedReports ?? 0,
            description: 'Resolved reports'
        },
        {
            title: 'In Progress Reports',
            value: stats?.pendingReports ?? 0,
            description: 'Reports to review'
        }
    ]

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="container">
                    <p className="text-muted">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="container">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4">
            <div className="container">

                <div className="mb-4">
                    <h1 className="fw-bold">
                        Admin Dashboard
                    </h1>

                    <p className="text-muted mb-0">
                        Welcome back, Admin. Here is what is happening
                        on HelpMe.ba.
                    </p>
                </div>

                <div className="row g-4 mb-4">
                    {dashboardStats.map((stat) => (
                        <div
                            className="col-md-6 col-xl-3"
                            key={stat.title}
                        >
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <h6 className="text-muted">
                                        {stat.title}
                                    </h6>

                                    <h2 className="fw-bold mt-3 mb-1">
                                        {stat.value}
                                    </h2>

                                    <p className="text-muted mb-0 small">
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">

                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h5 className="fw-bold mb-1">
                                            Recent Activity
                                        </h5>

                                        <p className="text-muted small mb-0">
                                            Latest activity on the platform
                                        </p>
                                    </div>
                                </div>

                                <div className="list-group list-group-flush">
                                    {recentActivity.length === 0 ? (
                                        <p className="text-muted mb-0">
                                            No recent activity.
                                        </p>
                                    ) : (
                                        recentActivity.map(
                                            (activity) => (
                                                <div
                                                    className="list-group-item px-0 py-3"
                                                    key={`${activity.type}-${activity.created_at}`}
                                                >
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h6 className="fw-semibold mb-1">
                                                                {activity.title}
                                                            </h6>

                                                            <p className="text-muted small mb-0">
                                                                {activity.description}
                                                            </p>
                                                        </div>

                                                        <small className="text-muted text-nowrap ms-3">
                                                            {getTimeAgo(
                                                                activity.created_at
                                                            )}
                                                        </small>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">

                        <div className="card border-0 shadow-sm">
                            <div className="card-body">

                                <h5 className="fw-bold mb-1">
                                    Quick Actions
                                </h5>

                                <p className="text-muted small mb-4">
                                    Frequently used admin actions
                                </p>

                                <div className="d-grid gap-2">

                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            navigate('/admin/users')
                                        }
                                    >
                                        Manage Users
                                    </button>

                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() =>
                                            navigate('/admin/jobs')
                                        }
                                    >
                                        Manage Jobs
                                    </button>

                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() =>
                                            navigate('/admin/reports')
                                        }
                                    >
                                        Review Reports
                                    </button>

                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() =>
                                            navigate('/admin/categories')
                                        }
                                    >
                                        Manage Categories
                                    </button>

                                </div>

                            </div>
                        </div>

                        <div className="card border-0 shadow-sm mt-4">
                            <div className="card-body">

                                <h5 className="fw-bold mb-3">
                                    Reports
                                </h5>

                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="text-muted">
                                            In progress
                                        </span>
                                    </div>

                                    <span className="badge bg-danger fs-6">
                                        {stats?.pendingReports ?? 0}
                                    </span>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default AdminDashboard