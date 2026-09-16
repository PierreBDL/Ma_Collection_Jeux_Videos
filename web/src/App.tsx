import './App.css'
import {Routes, Route} from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
