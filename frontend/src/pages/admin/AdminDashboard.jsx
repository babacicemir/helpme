import { useNavigate } from "react-router-dom"

function AdminDashboard() {

    const navigate = useNavigate()

    const stats = [
        {
            title: 'Total Users',
            value: '1,248',
            description: 'Registered users'
        },
        {
            title: 'Total Jobs',
            value: '532',
            description: 'Jobs posted'
        },
        {
            title: 'Pending Reports',
            value: '18',
            description: 'Reports to review'
        },
        {
            title: 'Blocked Users',
            value: '12',
            description: 'Currently blocked'
        }
    ]

    const recentActivity = [
        {
            action: 'New user registered',
            details: 'User emirtest joined HelpMe.ba',
            time: '2 minutes ago'
        },
        {
            action: 'New job created',
            details: 'Website development',
            time: '8 minutes ago'
        },
        {
            action: 'New report submitted',
            details: 'Spam report against a user',
            time: '15 minutes ago'
        },
        {
            action: 'New job created',
            details: 'Home appliance repair',
            time: '32 minutes ago'
        }
    ]

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
                    {stats.map((stat) => (
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
                                    {recentActivity.map(
                                        (activity, index) => (
                                            <div
                                                className="list-group-item px-0 py-3"
                                                key={index}
                                            >
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <h6 className="fw-semibold mb-1">
                                                            {activity.action}
                                                        </h6>

                                                        <p className="text-muted small mb-0">
                                                            {activity.details}
                                                        </p>
                                                    </div>

                                                    <small className="text-muted text-nowrap ms-3">
                                                        {activity.time}
                                                    </small>
                                                </div>
                                            </div>
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
                                    onClick={() => navigate('/admin/users')}
                                    >
                                        Manage Users
                                    </button>

                                    <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => navigate('/admin/jobs')}
                                    >
                                        Manage Jobs
                                    </button>

                                    <button 
                                    className="btn btn-outline-primary"
                                    >
                                        Review Reports
                                    </button>

                                    <button className="btn btn-outline-primary"
                                    onClick={() => navigate('/admin/categories')}
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
                                            Require attention
                                        </span>
                                    </div>

                                    <span className="badge bg-danger fs-6">
                                        18
                                    </span>
                                </div>

                                <button className="btn btn-danger w-100 mt-3">
                                    Review Reports
                                </button>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default AdminDashboard