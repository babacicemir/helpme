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
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">
                        Categories
                    </h1>

                    <p className="text-muted mb-0">
                        Manage job categories on HelpMe.ba
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleOpenAdd}
                >
                    Add Category
                </button>
            </div>

            {success && (
                <div className="alert alert-success text-center">
                    {success}
                </div>
            )}

            {error && !showForm && (
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            )}

            {loading && (
                <div className="alert alert-info text-center">
                    Loading categories...
                </div>
            )}

            {!loading && categories.length === 0 && (
                <div className="alert alert-info text-center">
                    There are currently no categories.
                </div>
            )}

            {!loading && categories.length > 0 && (
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>
                                                {category.name}
                                            </td>

                                            <td>
                                                {category.description ||
                                                    'No description'}
                                            </td>

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        setSelectedCategory(
                                                            category
                                                        )
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

            {selectedCategory && (
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
                                        Category Details
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            setSelectedCategory(null)
                                        }
                                        disabled={deleteLoading}
                                    />
                                </div>

                                <div className="modal-body">

                                    <div className="mb-3">
                                        <strong>
                                            Name:
                                        </strong>{' '}
                                        {selectedCategory.name}
                                    </div>

                                    <div className="mb-3">
                                        <strong>
                                            Description:
                                        </strong>

                                        <div className="mt-1">
                                            {selectedCategory.description ||
                                                'No description'}
                                        </div>
                                    </div>

                                    <div>
                                        <strong>
                                            Created:
                                        </strong>{' '}

                                        {selectedCategory.created_at
                                            ? new Date(
                                                selectedCategory.created_at
                                            ).toLocaleDateString()
                                            : 'Unknown'}
                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleOpenEdit}
                                        disabled={deleteLoading}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
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

                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            {showForm && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">

                                <form onSubmit={handleSubmit}>

                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            {editingCategory
                                                ? 'Edit Category'
                                                : 'Add Category'}
                                        </h5>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={handleCloseForm}
                                            disabled={formLoading}
                                        />
                                    </div>

                                    <div className="modal-body">

                                        {error && (
                                            <div className="alert alert-danger">
                                                {error}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label
                                                htmlFor="categoryName"
                                                className="form-label"
                                            >
                                                Name
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

                                        <div className="mb-3">
                                            <label
                                                htmlFor="categoryDescription"
                                                className="form-label"
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

                                    <div className="modal-footer">

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleCloseForm}
                                            disabled={formLoading}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={formLoading}
                                        >
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

                    <div className="modal-backdrop fade show"></div>
                </>
            )}

        </div>
    )
}

export default AdminCategories