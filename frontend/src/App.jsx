import Navbar from './components/Navbar';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './features/auth/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './features/auth/pages/signup'
import AuthSuccess from './features/auth/authsuccess'
import Home from './features/auth/pages/home';
import PrivateRoute from './components/PrivateRoute';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
        <Container className="py-4">
          <Routes>
            <Route path='/auth/success' element={<AuthSuccess />} />
            <Route path='/login' element={<LoginPage />}></Route>
            <Route path='/' element={<PrivateRoute />}>
              <Route path='/main' element={<Home />} />
            </Route>
          </Routes>
        </Container>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
