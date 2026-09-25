import { Routes, Route } from 'react-router-dom'
import Home from '../pages/home/Home'
import Login from '../pages/auth/Login.jsx'
import Signup from '../pages/auth/Signup.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AdminRoute from './AdminRoute.jsx'
import AdminUsers from '../pages/admin/AdminUsers.jsx'
import AdminJobs from '../pages/admin/AdminJobs.jsx'
import AdminCategories from '../pages/admin/AdminCategories.jsx'
import AdminReports from '../pages/admin/AdminReports.jsx'
import Jobs from '../pages/user/jobs/Jobs.jsx'
import MyJobs from '../pages/user/jobs/MyJobs.jsx'

function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route element={<AdminRoute />}>
                <Route path='/admin' element={<AdminDashboard/>}/>
                <Route path='/admin/users' element={<AdminUsers/>} />
                <Route path='/admin/jobs' element={<AdminJobs/>}/>
                <Route path='/admin/categories' element={<AdminCategories/>}/>
                <Route path='/admin/reports' element={<AdminReports/>}/>
            </Route>
            <Route path='/jobs' element={<Jobs/>}/>
            <Route path='/my-jobs' element={<MyJobs/>}/>
        </Routes>
    )
}

export default AppRoutes