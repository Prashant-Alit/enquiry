import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import {  signIn as sendSignInRequest } from '../api/auth';


function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await sendSignInRequest(email, password);
    const { UserName } = result?.data?.data;
    const Token = result?.data?.data?.AuthenticateToken;
    if (result.isOk) {
      setUser(result?.data?.data?.UserName);
      localStorage.setItem('user', JSON.stringify(UserName));
      localStorage.setItem('token', Token)
    }
    return result;
  }, []);

  const signOut = useCallback(() => {
    setUser(undefined);
    localStorage.removeItem('user')
    localStorage.removeItem('token'); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }} {...props} />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
