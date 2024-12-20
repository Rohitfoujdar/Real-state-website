import React, { createContext, useContext, useEffect, useState } from 'react';
import { API } from '../config';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user:null,
    token:"",
    refreshToken:""
  });

  useEffect(()=>{
    const fromLS = localStorage.getItem("auth")
    if(fromLS) setAuth(JSON.parse(fromLS))
  },[])

  axios.defaults.baseURL = API

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // Return the value of AuthContext
};