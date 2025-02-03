import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";

import { AppContext } from '../Context/AppContext';

export default function Home() {
  const { user, setUser, setShowNav } = useContext(AppContext);
  useEffect(() => {
    setShowNav(true);
    
  },[]);

  
  

  return (
    <>
    <h1 className="text-white text-xl title">Latest post </h1>
    </>
  );
}

