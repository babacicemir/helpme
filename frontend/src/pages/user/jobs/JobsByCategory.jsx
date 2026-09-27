import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getCategories, getJobsByCategory } from '../../../services/userService'

function JobsByCategory() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const categoryId = searchParams.get('categoryId')

    const [categories, setCategories] = useState([])
    const [jobs, setJobs] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(categoryId || '')

    const [loadingCategories, setLoadingCategories] = useState(true)
    const [loadingJobs, setLoadingJobs] = useState(true)

    const [categoriesError, setCategoriesError] = useState('')
    const [jobsError, setJobsError] = useState('')

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await getCategories()

                setCategories(response.data)
            } catch (error) {
                console.error('CATEGORIES ERROR:', error)

                setCategoriesError('Failed to load categories')
            } finally {
                setLoadingCategories(false)
            }
        }

        loadCategories()
    }, [])

    useEffect(() => {
        if (!categoryId) {
            setJobs([])
            setLoadingJobs(false)
            return
        }

        const loadJobs = async () => {
            setLoadingJobs(true)
            setJobsError('')

            try {
                const response = await getJobsByCategory(categoryId)

                setJobs(response.data)
            } catch (error) {
                console.error('JOBS BY CATEGORY ERROR:', error)

                setJobs([])
                setJobsError(
                    error.response?.data?.message ||
                    'Failed to load jobs'
                )
            } finally {
                setLoadingJobs(false)
            }
        }

        loadJobs()
    }, [categoryId])

    const handleFindJobs = () => {
        if (!selectedCategory) {
            return
        }

        setSearchParams({
            categoryId: selectedCategory
        })
    }

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

            <section className="bg-primary text-white py-5">
                <div className="container py-4">

                    <div className="text-center">

                        <h1 className="fw-bold mb-3">
                            Find Jobs by Category
                        </h1>

                        <p className="lead mb-0">
                            Choose a category and find jobs that match your interests
                        </p>

                    </div>

                </div>
            </section>


            <section className="py-5">

                <div className="container">

                    <div className="row justify-content-center">

                        <div className="col-lg-8">

                            <div className="text-center mb-4">

                                <h4 className="fw-bold">
                                    Select a category
                                </h4>

                                <p className="text-muted mb-0">
                                    Choose another category if you want to explore different jobs
                                </p>

                            </div>

                            {categoriesError ? (

                                <div className="alert alert-danger text-center">
                                    {categoriesError}
                                </div>

                            ) : (

                                <div className="d-flex flex-column flex-sm-row gap-3">

                                    <select
                                        className="form-select form-select-lg"
                                        value={selectedCategory}
                                        onChange={(event) =>
                                            setSelectedCategory(event.target.value)
                                        }
                                        disabled={loadingCategories}
                                    >

                                        <option value="">
                                            {loadingCategories
                                                ? 'Loading categories...'
                                                : 'Select a category'}
                                        </option>

                                        {categories.map((category) => (

                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>

                                        ))}

                                    </select>

                                    <button
                                        className="btn btn-primary btn-lg px-4"
                                        onClick={handleFindJobs}
                                        disabled={!selectedCategory}
                                    >
                                        Find Jobs
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </section>


            <section className="py-5 bg-light">

                <div className="container">

                    <div className="mb-5">

                        <h2 className="fw-bold mb-2">
                            Available Jobs
                        </h2>

                        <p className="text-muted mb-0">
                            Jobs posted by the HelpMe.ba community
                        </p>

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

                            <div className="col-12">

                                <div className="text-center py-5">

                                    <h5 className="fw-bold mb-2">
                                        No jobs found
                                    </h5>

                                    <p className="text-muted mb-0">
                                        There are currently no jobs available in this category.
                                        Try selecting another category.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            jobs.map((job) => (

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
                                                    {getTimeAgo(job.created_at)}
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
                                                        {job.location || 'Not specified'}
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
                                                        navigate(`/jobs/${job.id}`)
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

        </div>
    )
}

export default JobsByCategory
