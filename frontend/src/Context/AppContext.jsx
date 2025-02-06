import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { createContext } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    // ローカルストレージから user を取得（なければ null）
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showNav, setShowNav] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {

    const fetchConfig = async () => {
      try {
        const res = await axios.get('/api/paypal/config', {
          withCredentials: true,
        })
        // console.log(res.data);
        setConfig(res.data);
      } catch (error) {
        console.error('failed fetching config: ', error);
      }
    }

    fetchConfig();
    setShowNav(true);
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, config, showNav, setShowNav }}>
      {children}
    </AppContext.Provider>
  );
}
