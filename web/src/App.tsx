import './App.css'
import {Routes, Route} from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import CommonPage from './pages/CommonPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import LibraryPage from './pages/LibraryPage'
import HomePage from './pages/HomePage'

function App() {

  return (
    <Routes>
      <Route element={<CommonPage />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
