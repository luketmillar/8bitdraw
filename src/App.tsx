import { Routes, Route } from 'react-router-dom'
import DrawPage from './pages/DrawPage'
import GalleryPage from './pages/GalleryPage'
import AuthPage from './pages/AuthPage'
import CreateProfilePage from './pages/CreateProfilePage'
import { AuthProvider } from './api/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/create-profile' element={<CreateProfilePage />} />
        <Route
          path='/draw/:sketchId'
          element={
            <ProtectedRoute>
              <DrawPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/draw'
          element={
            <ProtectedRoute>
              <DrawPage />
            </ProtectedRoute>
          }
        />
        <Route path='/' element={<GalleryPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
