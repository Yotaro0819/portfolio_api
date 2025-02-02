import React, { useEffect, useState } from 'react';
import { createContext } from "react";
import axios from 'axios';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    setShowNav(true);
    const checkAuth = async () => {
      try {
        const response = await axios.get('api/check-auth', {
          withCredentials: true,
        });
        
        if(response.data.user) {
          setUser(response.data.user);
          console.log(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
      }
    };
    checkAuth();
  },[]);


  return (
    <AppContext.Provider value={{ user, setUser, showNav, setShowNav }}>
      {children}
    </AppContext.Provider>
  );
}