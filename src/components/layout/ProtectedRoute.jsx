import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import FullScreenLoader from '../ui/FullScreenLoader'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (!user) return <Navigate to="/" replace />
  return children
}
