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
        description: 'Registered users',
        icon: 'bi-people'
    },
    {
        title: 'Blocked Users',
        value: stats?.blockedUsers ?? 0,
        description: 'Currently blocked',
        icon: 'bi-person-x'
    },
    {
        title: 'Total Jobs',
        value: stats?.totalJobs ?? 0,
        description: 'Jobs posted',
        icon: 'bi-briefcase'
    },
    {
        title: 'Total Categories',
        value: stats?.totalCategories ?? 0,
        description: 'Available categories',
        icon: 'bi-grid'
    },
    {
        title: 'Total Reports',
        value: stats?.totalReports ?? 0,
        description: 'All submitted reports',
        icon: 'bi-flag'
    },
    {
        title: 'Resolved Reports',
        value: stats?.resolvedReports ?? 0,
        description: 'Resolved reports',
        icon: 'bi-check-circle'
    },
    {
        title: 'In Progress Reports',
        value: stats?.pendingReports ?? 0,
        description: 'Reports to review',
        icon: 'bi-exclamation-circle'
    }
]

if (loading) {
    return (
        <div className="container-fluid bg-light min-vh-100 py-5">
            <div className="container">
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="text-muted mb-0">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        </div>
    )
}

if (error) {
    return (
        <div className="container-fluid bg-light min-vh-100 py-5">
            <div className="container">
                <div className="alert alert-danger shadow-sm">
                    {error}
                </div>
            </div>
        </div>
    )
}

return (
    <div className="container-fluid bg-light min-vh-100 py-5">

        <div className="container">

            <div className="mb-5">

                <p className="text-primary fw-semibold mb-2">
                    Administration
                </p>

                <h1 className="fw-bold mb-2">
                    Admin Dashboard
                </h1>

                <p className="text-muted mb-0">
                    Welcome back, Admin. Here is what is happening
                    on HelpMe.ba.
                </p>

            </div>

            <div className="row g-4 mb-5">

                {dashboardStats.map((stat) => (
                    <div
                        className="col-sm-6 col-xl-3"
                        key={stat.title}
                    >

                        <div
                            className="card border-0 shadow h-100"
                            style={{
                                borderRadius: '12px'
                            }}
                        >

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>

                                        <p className="text-muted fw-medium mb-2">
                                            {stat.title}
                                        </p>

                                        <h2 className="fw-bold mb-2 display-6">
                                            {stat.value}
                                        </h2>

                                        <p className="text-muted small mb-0">
                                            {stat.description}
                                        </p>

                                    </div>

                                    <div
                                        className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                                        style={{
                                            width: '48px',
                                            height: '48px'
                                        }}
                                    >
                                        <i
                                            className={`bi ${stat.icon} fs-5`}
                                        />
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                ))}

            </div>

            <div className="row g-4">

                <div className="col-lg-8">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="mb-4">
                                <h5 className="fw-bold mb-1">
                                    Recent Activity
                                </h5>

                                <p className="text-muted small mb-0">
                                    Latest activity on the platform
                                </p>
                            </div>

                            <div className="list-group list-group-flush">

                                {recentActivity.length === 0 ? (

                                    <div className="text-center py-4">
                                        <i className="bi bi-inbox fs-2 text-muted" />

                                        <p className="text-muted mb-0 mt-2">
                                            No recent activity.
                                        </p>
                                    </div>

                                ) : (

                                    recentActivity.map((activity) => (

                                        <div
                                            className="list-group-item px-0 py-3"
                                            key={`${activity.type}-${activity.created_at}`}
                                        >

                                            <div className="d-flex align-items-start">

                                                <div
                                                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                                                    style={{
                                                        width: '38px',
                                                        height: '38px'
                                                    }}
                                                >
                                                    <i className="bi bi-activity" />
                                                </div>

                                                <div className="flex-grow-1">

                                                    <div className="d-flex flex-column flex-md-row justify-content-between gap-1">

                                                        <h6 className="fw-semibold mb-1">
                                                            {activity.title}
                                                        </h6>

                                                        <small className="text-muted text-nowrap">
                                                            {getTimeAgo(
                                                                activity.created_at
                                                            )}
                                                        </small>

                                                    </div>

                                                    <p className="text-muted small mb-0">
                                                        {activity.description}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    ))

                                )}

                            </div>

                        </div>

                    </div>

                </div>

                <div className="col-lg-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4">

                            <h5 className="fw-bold mb-1">
                                Quick Actions
                            </h5>

                            <p className="text-muted small mb-4">
                                Frequently used admin actions
                            </p>

                            <div className="d-grid gap-2">

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() =>
                                        navigate('/admin/users')
                                    }
                                >
                                    <i className="bi bi-people me-2" />
                                    Manage Users
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        navigate('/admin/jobs')
                                    }
                                >
                                    <i className="bi bi-briefcase me-2" />
                                    Manage Jobs
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        navigate('/admin/reports')
                                    }
                                >
                                    <i className="bi bi-flag me-2" />
                                    Review Reports
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        navigate('/admin/categories')
                                    }
                                >
                                    <i className="bi bi-grid me-2" />
                                    Manage Categories
                                </button>

                            </div>

                        </div>

                    </div>

                    <div className="card border-0 shadow-sm mt-4">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-3">

                                <div
                                    className="bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '42px',
                                        height: '42px'
                                    }}
                                >
                                    <i className="bi bi-flag-fill" />
                                </div>

                                <div>
                                    <h5 className="fw-bold mb-0">
                                        Reports
                                    </h5>

                                    <small className="text-muted">
                                        Require your attention
                                    </small>
                                </div>

                            </div>

                            <div className="d-flex justify-content-between align-items-center border-top pt-3">

                                <span className="text-muted">
                                    In progress
                                </span>

                                <span className="badge bg-danger rounded-pill fs-6 px-3">
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

