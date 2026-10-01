import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    getCategories,
    getJobsByCategory
} from '../../../services/userService'

function JobsByCategory() {
    const [searchParams, setSearchParams] = useSearchParams()

    const categoryId = searchParams.get('categoryId')

    const [categories, setCategories] = useState([])
    const [jobs, setJobs] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(
        categoryId || ''
    )

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

        const diffInMinutes = Math.floor(diffInSeconds / 60)

        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${
                diffInMinutes === 1 ? 'minute' : 'minutes'
            } ago`
        }

        const diffInHours = Math.floor(diffInMinutes / 60)

        if (diffInHours < 24) {
            return `${diffInHours} ${
                diffInHours === 1 ? 'hour' : 'hours'
            } ago`
        }

        const diffInDays = Math.floor(diffInHours / 24)

        if (diffInDays < 30) {
            return `${diffInDays} ${
                diffInDays === 1 ? 'day' : 'days'
            } ago`
        }

        const diffInMonths = Math.floor(diffInDays / 30)

        return `${diffInMonths} ${
            diffInMonths === 1 ? 'month' : 'months'
        } ago`
    }

    return (
        <div className="bg-light min-vh-100">

            <section className="bg-primary text-white py-5">

                <div className="container py-5">

                    <div className="row justify-content-center">

                        <div className="col-lg-8 text-center">

                            <div
                                className="bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                style={{
                                    width: '72px',
                                    height: '72px'
                                }}
                            >
                                <i className="bi bi-grid-3x3-gap fs-2" />
                            </div>

                            <h1 className="display-5 fw-bold mb-3">
                                Find Jobs by Category
                            </h1>

                            <p className="lead mb-0">
                                Choose a category and discover jobs
                                that match your interests
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            <section className="py-5">

                <div className="container">

                    <div className="row justify-content-center">

                        <div className="col-lg-8">

                            <div
                                className="card border-0 shadow-sm"
                                style={{
                                    borderRadius: '14px'
                                }}
                            >

                                <div className="card-body p-4 p-md-5">

                                    <div className="text-center mb-4">

                                        <div
                                            className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{
                                                width: '50px',
                                                height: '50px'
                                            }}
                                        >
                                            <i className="bi bi-search fs-5" />
                                        </div>

                                        <h4 className="fw-bold mb-2">
                                            Explore a category
                                        </h4>

                                        <p className="text-muted mb-0">
                                            Select a category to see available jobs
                                        </p>

                                    </div>

                                    {categoriesError ? (

                                        <div className="alert alert-danger border-0">
                                            <i className="bi bi-exclamation-circle me-2" />
                                            {categoriesError}
                                        </div>

                                    ) : (

                                        <div className="row g-3">

                                            <div className="col-md-8">

                                                <select
                                                    className="form-select form-select-lg"
                                                    value={selectedCategory}
                                                    onChange={(event) =>
                                                        setSelectedCategory(
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        loadingCategories
                                                    }
                                                >

                                                    <option value="">
                                                        {loadingCategories
                                                            ? 'Loading categories...'
                                                            : 'Select a category'}
                                                    </option>

                                                    {categories.map(
                                                        (category) => (

                                                            <option
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                            >
                                                                {
                                                                    category.name
                                                                }
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </div>

                                            <div className="col-md-4">

                                                <button
                                                    className="btn btn-primary btn-lg w-100"
                                                    onClick={
                                                        handleFindJobs
                                                    }
                                                    disabled={
                                                        !selectedCategory
                                                    }
                                                >
                                                    <i className="bi bi-search me-2" />
                                                    Find Jobs
                                                </button>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <section className="py-5">

                <div className="container">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2">

                        <div>

                            <p className="text-primary fw-semibold mb-2">
                                Job opportunities
                            </p>

                            <h2 className="fw-bold mb-2">
                                Available Jobs
                            </h2>

                            <p className="text-muted mb-0">
                                Jobs posted by the HelpMe.ba community
                            </p>

                        </div>

                        {categoryId && !loadingJobs && (
                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                {jobs.length} {
                                    jobs.length === 1
                                        ? 'job'
                                        : 'jobs'
                                }
                            </span>
                        )}

                    </div>

                    <div className="row g-4">

                        {loadingJobs ? (

                            <div className="col-12">

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
                                            Loading jobs...
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ) : jobsError ? (

                            <div className="col-12">

                                <div className="alert alert-danger border-0 shadow-sm">
                                    <i className="bi bi-exclamation-circle-fill me-2" />
                                    {jobsError}
                                </div>

                            </div>

                        ) : jobs.length === 0 ? (

                            <div className="col-12">

                                <div className="card border-0 shadow-sm">

                                    <div className="card-body text-center py-5">

                                        <div
                                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{
                                                width: '68px',
                                                height: '68px'
                                            }}
                                        >
                                            <i className="bi bi-briefcase fs-3" />
                                        </div>

                                        <h5 className="fw-bold mb-2">
                                            No Jobs Found
                                        </h5>

                                        <p className="text-muted mb-0">
                                            There are currently no jobs available
                                            in this category. Try selecting another
                                            category.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            jobs.map((job) => (

                                <div
                                    className="col-md-6 col-xl-4"
                                    key={job.id}
                                >

                                    <div
                                        className="card border-0 shadow-sm h-100"
                                        style={{
                                            borderRadius: '14px'
                                        }}
                                    >

                                        <div className="card-body p-4 d-flex flex-column">

                                            <div className="d-flex justify-content-between align-items-start mb-4">

                                                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                                    <i className="bi bi-tag me-1" />
                                                    {job.category}
                                                </span>

                                                <small className="text-muted">
                                                    <i className="bi bi-clock me-1" />
                                                    {getTimeAgo(
                                                        job.created_at
                                                    )}
                                                </small>

                                            </div>

                                            <h5 className="fw-bold mb-3">
                                                {job.title}
                                            </h5>

                                            <p
                                                className="text-muted mb-4"
                                                style={{
                                                    minHeight: '48px'
                                                }}
                                            >
                                                {job.description}
                                            </p>

                                            <div className="mt-auto">

                                                <div className="border-top pt-3 mb-3">

                                                    <div className="d-flex justify-content-between mb-2">

                                                        <span className="text-muted small">
                                                            <i className="bi bi-geo-alt me-1" />
                                                            Location
                                                        </span>

                                                        <span className="fw-medium small">
                                                            {job.location ||
                                                                'Not specified'}
                                                        </span>

                                                    </div>

                                                    <div className="d-flex justify-content-between">

                                                        <span className="text-muted small">
                                                            <i className="bi bi-cash me-1" />
                                                            Budget
                                                        </span>

                                                        <span className="fw-bold text-primary">
                                                            {job.budget} KM
                                                        </span>

                                                    </div>

                                                </div>

                                                <button
                                                    className="btn btn-outline-primary w-100"
                                                    onClick={() =>
                                                        window.location.href = `/jobs/${job.id}`
                                                    }
                                                >
                                                    <i className="bi bi-eye me-2" />
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
