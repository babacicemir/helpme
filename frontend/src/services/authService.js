import api from './api'

const signup = async (userData) => {
    const response = await api.post('/helpme.ba/signup', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        location: userData.location,
        bio: userData.bio,
        profileImg: userData.profileImg
    })

    return response.data
}

const login = async (credentials) => {
    const response = await api.post('/helpme.ba/login', credentials)

    return response.data
}

export {
    signup,
    login
}