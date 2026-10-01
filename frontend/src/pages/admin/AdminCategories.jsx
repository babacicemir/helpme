import { useEffect, useState } from 'react'
import {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
} from '../../services/adminService'

function AdminCategories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [selectedCategory, setSelectedCategory] = useState(null)

    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const [formLoading, setFormLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories()

                setCategories(response.data)
            } catch (error) {
                console.error(
                    'GET CATEGORIES ERROR:',
                    error
                )

                setError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Failed to load categories'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const resetForm = () => {
        setName('')
        setDescription('')
        setEditingCategory(null)
    }

    const handleOpenAdd = () => {
        resetForm()
        setError('')
        setSuccess('')
        setShowForm(true)
    }

    const handleOpenEdit = () => {
        setName(selectedCategory.name)
        setDescription(
            selectedCategory.description || ''
        )
        setEditingCategory(selectedCategory)
        setSelectedCategory(null)
        setError('')
        setSuccess('')
        setShowForm(true)
    }

    const handleCloseForm = () => {
        if (formLoading) {
            return
        }

        setShowForm(false)
        resetForm()
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!name.trim()) {
            setError('Category name is required')
            return
        }

        try {
            setFormLoading(true)
            setError('')
            setSuccess('')

            const categoryData = {
                name: name.trim(),
                description: description.trim()
            }

            if (editingCategory) {
                const response = await updateCategory(
                    editingCategory.id,
                    categoryData
                )

                setCategories((currentCategories) =>
                    currentCategories.map((category) =>
                        category.id === editingCategory.id
                            ? response.data
                            : category
                    )
                )

                setSuccess(
                    'Category updated successfully.'
                )
            } else {
                const response = await addCategory(
                    categoryData
                )

                setCategories((currentCategories) => [
                    response.data,
                    ...currentCategories
                ])

                setSuccess(
                    'Category added successfully.'
                )
            }

            setShowForm(false)
            resetForm()
        } catch (error) {
            console.error(
                'CATEGORY SAVE ERROR:',
                error
            )

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to save category'
            )
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete category "${selectedCategory.name}"?`
        )

        if (!confirmed) {
            return
        }

        try {
            setDeleteLoading(true)
            setError('')
            setSuccess('')

            await deleteCategory(
                selectedCategory.id
            )

            setCategories((currentCategories) =>
                currentCategories.filter(
                    (category) =>
                        category.id !== selectedCategory.id
                )
            )

            setSelectedCategory(null)

            setSuccess(
                'Category deleted successfully.'
            )
        } catch (error) {
            console.error(
                'DELETE CATEGORY ERROR:',
                error
            )

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to delete category'
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
                                Categories
                            </h1>

                            <p className="text-muted mb-0">
                                Manage job categories on HelpMe.ba
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-3">

                            <div className="bg-white rounded-3 shadow-sm px-4 py-3">
                                <div className="d-flex align-items-center gap-3">

                                    <div
                                        className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '44px',
                                            height: '44px'
                                        }}
                                    >
                                        <i className="bi bi-grid fs-5" />
                                    </div>

                                    <div>
                                        <small className="text-muted d-block">
                                            Total Categories
                                        </small>

                                        <span className="fw-bold fs-5">
                                            {categories.length}
                                        </span>
                                    </div>

                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary px-3 py-2"
                                onClick={handleOpenAdd}
                            >
                                <i className="bi bi-plus-lg me-1" />
                                Add Category
                            </button>

                        </div>

                    </div>

                </div>

                {success && (
                    <div className="alert alert-success border-0 shadow-sm d-flex align-items-center mb-4">
                        <i className="bi bi-check-circle-fill me-2" />
                        {success}
                    </div>
                )}

                {error && !showForm && (
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
                                Loading categories...
                            </p>

                        </div>
                    </div>
                )}

                {!loading && !error && categories.length === 0 && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">

                            <div
                                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{
                                    width: '64px',
                                    height: '64px'
                                }}
                            >
                                <i className="bi bi-grid fs-3" />
                            </div>

                            <h5 className="fw-bold">
                                No Categories Found
                            </h5>

                            <p className="text-muted mb-3">
                                There are currently no job categories.
                            </p>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleOpenAdd}
                            >
                                <i className="bi bi-plus-lg me-1" />
                                Add Category
                            </button>

                        </div>
                    </div>
                )}

                {!loading && !error && categories.length > 0 && (
                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-0">

                            <div className="px-4 py-3 border-bottom">

                                <h5 className="fw-bold mb-1">
                                    Job Categories
                                </h5>

                                <p className="text-muted small mb-0">
                                    View and manage all available job categories
                                </p>

                            </div>

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">

                                        <tr>

                                            <th className="px-4">
                                                Category
                                            </th>

                                            <th>
                                                Description
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

                                        {categories.map((category) => (

                                            <tr key={category.id}>

                                                <td className="px-4">

                                                    <div className="d-flex align-items-center">

                                                        <div
                                                            className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                            style={{
                                                                width: '42px',
                                                                height: '42px'
                                                            }}
                                                        >
                                                            <i className="bi bi-grid fs-5" />
                                                        </div>

                                                        <span className="fw-semibold">
                                                            {category.name}
                                                        </span>

                                                    </div>

                                                </td>

                                                <td>

                                                    <span className="text-secondary">

                                                        {category.description ||
                                                            'No description'}

                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="text-muted">

                                                        {category.created_at
                                                            ? new Date(
                                                                category.created_at
                                                            ).toLocaleDateString()
                                                            : 'Unknown'}

                                                    </span>

                                                </td>

                                                <td className="text-end px-4">

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary px-3"
                                                        onClick={() =>
                                                            setSelectedCategory(
                                                                category
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

            {selectedCategory && (
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
                                            <i className="bi bi-grid fs-5" />
                                        </div>

                                        <div>

                                            <h5 className="modal-title fw-bold mb-0">
                                                Category Details
                                            </h5>

                                            <small className="text-muted">
                                                Category information
                                            </small>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            setSelectedCategory(null)
                                        }
                                        disabled={deleteLoading}
                                        aria-label="Close"
                                    />

                                </div>

                                <div className="modal-body px-4 py-4">

                                    <div className="text-center mb-4">

                                        <div
                                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{
                                                width: '70px',
                                                height: '70px'
                                            }}
                                        >
                                            <i className="bi bi-grid fs-2" />
                                        </div>

                                        <h4 className="fw-bold mb-1">
                                            {selectedCategory.name}
                                        </h4>

                                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                            Job Category
                                        </span>

                                    </div>

                                    <div className="bg-light rounded-3 p-3 mb-3">

                                        <small className="text-muted d-block mb-2">
                                            Description
                                        </small>

                                        <p className="mb-0 text-secondary">
                                            {selectedCategory.description ||
                                                'No description provided'}
                                        </p>

                                    </div>

                                    <div className="bg-light rounded-3 p-3">

                                        <small className="text-muted d-block mb-1">
                                            Created
                                        </small>

                                        <span className="fw-medium">
                                            <i className="bi bi-calendar-event me-2 text-primary" />

                                            {selectedCategory.created_at
                                                ? new Date(
                                                    selectedCategory.created_at
                                                ).toLocaleDateString()
                                                : 'Unknown'}
                                        </span>

                                    </div>

                                </div>

                                <div className="modal-footer px-4 py-3">

                                    <button
                                        type="button"
                                        className="btn btn-primary px-3"
                                        onClick={handleOpenEdit}
                                        disabled={deleteLoading}
                                    >
                                        <i className="bi bi-pencil me-1" />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger px-3"
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
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
                                            setSelectedCategory(null)
                                        }
                                        disabled={deleteLoading}
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

            {showForm && (
                <>

                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                    >

                        <div className="modal-dialog modal-dialog-centered">

                            <div className="modal-content border-0 shadow-lg">

                                <form onSubmit={handleSubmit}>

                                    <div className="modal-header px-4 py-3">

                                        <div className="d-flex align-items-center">

                                            <div
                                                className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '44px',
                                                    height: '44px'
                                                }}
                                            >
                                                <i
                                                    className={`bi ${
                                                        editingCategory
                                                            ? 'bi-pencil'
                                                            : 'bi-plus-lg'
                                                    } fs-5`}
                                                />
                                            </div>

                                            <div>

                                                <h5 className="modal-title fw-bold mb-0">
                                                    {editingCategory
                                                        ? 'Edit Category'
                                                        : 'Add Category'}
                                                </h5>

                                                <small className="text-muted">
                                                    {editingCategory
                                                        ? 'Update category information'
                                                        : 'Create a new job category'}
                                                </small>

                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={handleCloseForm}
                                            disabled={formLoading}
                                            aria-label="Close"
                                        />

                                    </div>

                                    <div className="modal-body px-4 py-4">

                                        {error && (
                                            <div className="alert alert-danger border-0 d-flex align-items-center">
                                                <i className="bi bi-exclamation-circle-fill me-2" />
                                                {error}
                                            </div>
                                        )}

                                        <div className="mb-3">

                                            <label
                                                htmlFor="categoryName"
                                                className="form-label fw-semibold"
                                            >
                                                Category Name
                                            </label>

                                            <input
                                                id="categoryName"
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(event) =>
                                                    setName(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter category name"
                                                disabled={formLoading}
                                            />

                                        </div>

                                        <div>

                                            <label
                                                htmlFor="categoryDescription"
                                                className="form-label fw-semibold"
                                            >
                                                Description
                                            </label>

                                            <textarea
                                                id="categoryDescription"
                                                className="form-control"
                                                rows="4"
                                                value={description}
                                                onChange={(event) =>
                                                    setDescription(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter category description"
                                                disabled={formLoading}
                                            />

                                        </div>

                                    </div>

                                    <div className="modal-footer px-4 py-3">

                                        <button
                                            type="button"
                                            className="btn btn-secondary px-3"
                                            onClick={handleCloseForm}
                                            disabled={formLoading}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary px-3"
                                            disabled={formLoading}
                                        >
                                            <i
                                                className={`bi ${
                                                    formLoading
                                                        ? 'bi-hourglass-split'
                                                        : editingCategory
                                                            ? 'bi-check-lg'
                                                            : 'bi-plus-lg'
                                                } me-1`}
                                            />

                                            {formLoading
                                                ? 'Saving...'
                                                : editingCategory
                                                    ? 'Update Category'
                                                    : 'Add Category'}
                                        </button>

                                    </div>

                                </form>

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

export default AdminCategories
