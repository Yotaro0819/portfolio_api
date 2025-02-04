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

  useEffect(() => {
    setShowNav(true);
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, showNav, setShowNav }}>
      {children}
    </AppContext.Provider>
  );
}
