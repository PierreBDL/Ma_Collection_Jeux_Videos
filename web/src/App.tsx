import './App.css'
import {Routes, Route} from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import CommonPage from './pages/CommonPage'
import RegisterPage from './pages/RegisterPage'

function App() {

  return (
    <Routes>
      <Route element={<CommonPage />}>
        <Route path="/" element={<div>Home</div>} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}

export default App
