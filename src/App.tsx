import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import VerifyRegistration from './pages/Auth/VerifyRegistration'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients/Patients'
import PatientDetail from './pages/Patients/PatientDetail'
import Backups from './pages/Backups'
import NotFound from './pages/NotFound'
import ProtectedLayout from './components/layout/ProtectedLayout'
import Profile from './pages/Profile'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-registration" element={<VerifyRegistration />} />

        <Route path="/app" element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
            <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="backups" element={<Backups />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-gray-800 text-white"
        progressClassName="bg-emerald-500"
      />
    </>
  )
}
