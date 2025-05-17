import { Routes, Route } from 'react-router-dom'
import DrawPage from './pages/DrawPage'
import GalleryPage from './pages/GalleryPage'

function App() {
  return (
    <>
      <Routes>
        <Route path='/draw' element={<DrawPage />} />
        <Route path='/' element={<GalleryPage />} />
      </Routes>
    </>
  )
}

export default App
