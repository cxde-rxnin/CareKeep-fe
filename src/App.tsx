import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients/Patients'
import PatientDetail from './pages/Patients/PatientDetail'
import Backups from './pages/Backups'
import NotFound from './pages/NotFound'
import ProtectedLayout from './components/layout/ProtectedLayout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/app" element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="backups" element={<Backups />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
