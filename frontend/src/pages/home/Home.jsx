import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLatestJobs } from '../../services/userService'

function Home() {

    const navigate = useNavigate()

    const [jobs, setJobs] = useState([])
    const [loadingJobs, setLoadingJobs] = useState(true)
    const [jobsError, setJobsError] = useState('')

    const categories = [
        {
            id: 1,
            name: 'Programming',
            description: 'Web development, software and technical help'
        },
        {
            id: 2,
            name: 'Design',
            description: 'Graphic design, UI/UX and creative work'
        },
        {
            id: 3,
            name: 'Home Repair',
            description: 'Repairs, maintenance and household work'
        },
        {
            id: 4,
            name: 'Cleaning',
            description: 'Cleaning and household assistance'
        },
        {
            id: 5,
            name: 'Moving',
            description: 'Moving, transportation and carrying'
        },
        {
            id: 6,
            name: 'Auto & Mechanics',
            description: 'Car repairs, maintenance and mechanics'
        }
    ]

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const response = await getLatestJobs()

                setJobs(response.data)
            } catch (error) {
                console.error('LATEST JOBS ERROR:', error)

                setJobsError('Failed to load jobs')
            } finally {
                setLoadingJobs(false)
            }
        }

        loadJobs()
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

        if (diffInDays < 30) {
            return `${diffInDays} ${
                diffInDays === 1 ? 'day' : 'days'
            } ago`
        }

        const diffInMonths = Math.floor(
            diffInDays / 30
        )

        return `${diffInMonths} ${
            diffInMonths === 1 ? 'month' : 'months'
        } ago`
    }

    return (
        <div>

            {/* Hero */}

            <section className="bg-primary text-white py-5">
                <div className="container py-5">

                    <div className="row align-items-center">

                        <div className="col-lg-7">

                            <h1 className="display-4 fw-bold mb-4">
                                Find the right help for your next task.
                            </h1>

                            <p className="lead mb-4">
                                Post a job, receive offers from people
                                who can help, and get your task done.
                            </p>

                            <div className="d-flex flex-column flex-sm-row gap-3">

                                <button
                                    className="btn btn-light btn-lg px-4"
                                    onClick={() =>
                                        navigate('/jobs')
                                    }
                                >
                                    Find Jobs
                                </button>

                                <button
                                    className="btn btn-outline-light btn-lg px-4"
                                    onClick={() =>
                                        navigate('/jobs/create')
                                    }
                                >
                                    Post a Job
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* Popular Categories */}

            <section className="py-5">

                <div className="container">

                    <div className="text-center mb-5">

                        <h2 className="fw-bold">
                            Popular Categories
                        </h2>

                        <p className="text-muted">
                            Find help across different types of tasks
                        </p>

                    </div>

                    <div className="row g-4">

                        {categories.map((category) => (
                            <div
                                className="col-md-6 col-lg-4"
                                key={category.id}
                            >

                                <div
                                    className="card border-0 shadow-sm h-100"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        navigate(
                                            `/jobs?category=${category.id}`
                                        )
                                    }
                                >

                                    <div className="card-body p-4">

                                        <h5 className="fw-bold mb-3">
                                            {category.name}
                                        </h5>

                                        <p className="text-muted mb-0">
                                            {category.description}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </section>


            {/* Latest Jobs */}

            <section className="py-5 bg-light">

                <div className="container">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">

                        <div>
                            <h2 className="fw-bold mb-2">
                                Latest Jobs
                            </h2>

                            <p className="text-muted mb-0">
                                Recently posted jobs from the HelpMe.ba community
                            </p>
                        </div>

                        <button
                            className="btn btn-outline-primary mt-3 mt-md-0"
                            onClick={() =>
                                navigate('/jobs')
                            }
                        >
                            View All Jobs
                        </button>

                    </div>


                    <div className="row g-4">

                        {loadingJobs ? (

                            <div className="col-12 text-center py-5">

                                <p className="text-muted mb-0">
                                    Loading jobs...
                                </p>

                            </div>

                        ) : jobsError ? (

                            <div className="col-12">

                                <div className="alert alert-danger">
                                    {jobsError}
                                </div>

                            </div>

                        ) : jobs.length === 0 ? (

                            <div className="col-12 text-center py-5">

                                <p className="text-muted mb-0">
                                    No jobs available at the moment.
                                </p>

                            </div>

                        ) : (

                            jobs.slice(0, 6).map((job) => (

                                <div
                                    className="col-md-6 col-xl-4"
                                    key={job.id}
                                >

                                    <div className="card border-0 shadow-sm h-100">

                                        <div className="card-body d-flex flex-column">

                                            <div className="d-flex justify-content-between align-items-start mb-3">

                                                <span className="badge bg-primary">
                                                    {job.category}
                                                </span>

                                                <small className="text-muted">
                                                    {getTimeAgo(
                                                        job.created_at
                                                    )}
                                                </small>

                                            </div>


                                            <h5 className="fw-bold mb-3">
                                                {job.title}
                                            </h5>


                                            <p className="text-muted mb-4">
                                                {job.description}
                                            </p>


                                            <div className="mt-auto">

                                                <div className="d-flex justify-content-between mb-2">

                                                    <span className="text-muted">
                                                        Location
                                                    </span>

                                                    <span className="fw-medium">
                                                        {job.location ||
                                                            'Not specified'}
                                                    </span>

                                                </div>


                                                <div className="d-flex justify-content-between mb-3">

                                                    <span className="text-muted">
                                                        Budget
                                                    </span>

                                                    <span className="fw-semibold">
                                                        {job.budget} KM
                                                    </span>

                                                </div>


                                                <button
                                                    className="btn btn-outline-primary w-100"
                                                    onClick={() =>
                                                        navigate(
                                                            `/jobs/${job.id}`
                                                        )
                                                    }
                                                >
                                                    View Job
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </section>


            {/* How HelpMe.ba Works */}

            <section className="py-5">

                <div className="container">

                    <div className="text-center mb-5">

                        <h2 className="fw-bold">
                            How HelpMe.ba Works
                        </h2>

                        <p className="text-muted">
                            Getting help is simple
                        </p>

                    </div>


                    <div className="row g-4 text-center">

                        <div className="col-md-4">

                            <div className="p-4">

                                <div className="display-5 fw-bold text-primary mb-3">
                                    1
                                </div>

                                <h5 className="fw-bold">
                                    Post a Job
                                </h5>

                                <p className="text-muted">
                                    Describe what you need help with,
                                    set your budget and provide the
                                    necessary details.
                                </p>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="p-4">

                                <div className="display-5 fw-bold text-primary mb-3">
                                    2
                                </div>

                                <h5 className="fw-bold">
                                    Receive Offers
                                </h5>

                                <p className="text-muted">
                                    People interested in your job can
                                    send you their offers and proposed
                                    prices.
                                </p>

                            </div>

                        </div>


                        <div className="col-md-4">

                            <div className="p-4">

                                <div className="display-5 fw-bold text-primary mb-3">
                                    3
                                </div>

                                <h5 className="fw-bold">
                                    Get It Done
                                </h5>

                                <p className="text-muted">
                                    Choose the right offer and get your
                                    task completed.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* CTA */}

            <section className="py-5 bg-primary text-white">

                <div className="container">

                    <div className="row align-items-center">

                        <div className="col-lg-8">

                            <h2 className="fw-bold mb-3">
                                Ready to get started?
                            </h2>

                            <p className="lead mb-0">
                                Post your first job or find an opportunity
                                to help someone today.
                            </p>

                        </div>


                        <div className="col-lg-4 mt-4 mt-lg-0">

                            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-lg-end">

                                <button
                                    className="btn btn-light"
                                    onClick={() =>
                                        navigate('/jobs/create')
                                    }
                                >
                                    Post a Job
                                </button>

                                <button
                                    className="btn btn-outline-light"
                                    onClick={() =>
                                        navigate('/jobs')
                                    }
                                >
                                    Find Jobs
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    )
}

export default Home
