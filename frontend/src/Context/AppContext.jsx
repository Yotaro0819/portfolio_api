import React, { useEffect, useState } from 'react';
import { createContext } from "react";
import axiosInstance from '../api/axios';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => {
    // ローカルストレージから user を取得（なければ null）
    const savedUser = localStorage.getItem("authUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {

    setShowNav(true);
  }, []);

  return (
    <AppContext.Provider value={{ authUser, setAuthUser, showNav, setShowNav }}>
      {children}
    </AppContext.Provider>
  );
}
