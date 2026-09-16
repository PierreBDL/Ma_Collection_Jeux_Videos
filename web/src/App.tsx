import './App.css'
import {Routes, Route} from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import Common from './pages/Common'

function App() {

  return (
    <Routes>
      <Route element={<Common />}>
        <Route path="/" element={<div>Home</div>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
