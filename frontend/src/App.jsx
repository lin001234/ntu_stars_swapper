import Navbar from './components/Navbar';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './components/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/signup'
import AuthSuccess from './pages/authsuccess'
import Home from './pages/home';
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
