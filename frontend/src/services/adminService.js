import api from './api'

const getAllUsers = async () => {
    const response = await api.get('/helpme.ba/admin/users')

    return response.data
}

const blockUser = async (id) => {
    const response = await api.patch(`/helpme.ba/admin/users/block/${id}`)

    return response.data
}

const unblockUser = async (id) => {
    const response = await api.patch(`/helpme.ba/admin/users/unblock/${id}`)

    return response.data
}

const deleteUser = async (id) => {
    const response = await api.delete(`/helpme.ba/admin/user/${id}`)

    return response.data
}

const getAllJobs = async() => {
    const response = await api.get('/helpme.ba/admin/jobs')

    return response.data
}

const deleteJob = async(id) => {
    const response = await api.delete(`/helpme.ba/admin/job/${id}`)

    return response.data
}

const getAllCategories = async () => {
    const response = await api.get('/helpme.ba/admin/categories')

    return response.data
}

const addCategory = async (categoryData) => {
    const response = await api.post('/helpme.ba/admin/category', categoryData)

    return response.data
}

const updateCategory = async (id, categoryData) => {
    const response = await api.patch(`/helpme.ba/admin/category/${id}`, categoryData)

    return response.data
}

const deleteCategory = async (id) => {
    const response = await api.delete(`/helpme.ba/admin/category/${id}`)

    return response.data
}

export {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
}