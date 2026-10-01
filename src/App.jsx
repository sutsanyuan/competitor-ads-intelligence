import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import AdsExplorer from './pages/AdsExplorer'
import AdDetail from './pages/AdDetail'
import Competitors from './pages/Competitors'
import Collections from './pages/Collections'
import ImportAd from './pages/ImportAd'
import Login from './pages/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ads" element={<AdsExplorer />} />
          <Route path="ads/:id" element={<AdDetail />} />
          <Route path="competitors" element={<Competitors />} />
          <Route path="collections" element={<Collections />} />
          <Route path="login" element={<Login />} />
          <Route path="import" element={<ProtectedRoute><ImportAd /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
