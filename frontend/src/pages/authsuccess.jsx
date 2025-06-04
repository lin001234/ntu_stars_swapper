import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/authContext';

function AuthSuccess(){
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
    fetch('http://localhost:3000/api/profile', {
      credentials: 'include', // sends the cookie automatically
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(() => {
        // If login successful, redirect to home
        navigate('/home');
      })
      .catch(() => {
        // If token invalid or no token, redirect to login page
        navigate('/login');
      });
  }, [navigate, setUser]);

    return <p>Logging in...</p>;
}
export default AuthSuccess;