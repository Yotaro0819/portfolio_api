import React, { useEffect, useState } from 'react';
import { createContext } from "react";
import axios from 'axios';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    // ローカルストレージから user を取得（なければ null）
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showNav, setShowNav] = useState(false);

  console.log(user);
  useEffect(() => {
    // 現在のページがログインページでない場合に認証チェックを実行
      // const checkAuth = async () => {
      //   try {
      //     const response = await axios.get('api/check-auth', {
      //       withCredentials: true,
      //     });
          

          
      //     if(response.data.user) {
      //       setUser(response.data.user);

      //     } else {
      //       setUser(null);
      //     }
      //   } catch (error) {
      //     // console.error('Authentication check failed:', error);
      //     setUser(null);
      //   }
      // };
      // checkAuth();

    setShowNav(true);
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, showNav, setShowNav }}>
      {children}
    </AppContext.Provider>
  );
}
