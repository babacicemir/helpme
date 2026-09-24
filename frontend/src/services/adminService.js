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

export {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser
}