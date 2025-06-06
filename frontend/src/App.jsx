import Navbar from './components/Navbar';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './features/auth/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './features/auth/pages/signup'
import AuthSuccess from './features/auth/authsuccess'
import Home from './features/posts/pages/home';
import PrivateRoute from './components/PrivateRoute';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

function App() {

  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
        <Container className="py-4">
          <Routes>
            <Route path='/auth/success' element={<AuthSuccess />} />
            <Route path='/login' element={<LoginPage />}></Route>
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
