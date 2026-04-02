import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@components/layout/Navbar'
import Beranda from '@pages/Beranda'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Beranda />} />
      </Routes>
    </BrowserRouter>
  )
}