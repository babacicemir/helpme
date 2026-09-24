import { Routes, Route } from 'react-router-dom'
import Home from '../pages/home/Home'
import Login from '../pages/auth/Login.jsx'
import Signup from '../pages/auth/Signup.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AdminRoute from './AdminRoute.jsx'
import AdminUsers from '../pages/admin/AdminUsers.jsx'

function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route element={<AdminRoute />}>
                <Route path='/admin' element={<AdminDashboard/>}/>
                <Route path='/admin/users' element={<AdminUsers/>} />
            </Route>
        </Routes>
    )
}

export default AppRoutes