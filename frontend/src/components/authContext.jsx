import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
export const AuthProvider = ({ children })=>{
    const [user, setUser] = useState(null); // Stores user data or null if not authenticated

  useEffect(() => {
    // Check user authentication status on app load
    fetch('http://localhost:3000/api/profile', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setUser(data))  // If authenticated, store user data
      .catch(() => setUser(null)); // If not authenticated, set user to null
},[]);
    return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};