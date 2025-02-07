import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context/AppContext';

const Profile = () => {

const { user } = useContext(AppContext);


  useEffect(() => {
   
  },[]) 


  return (
    <>
    {!user ? (
      <div></div>
    )
    :
    (
      <>
      <div>Profile</div>
      <p>{user.name}</p>
      <p>{user.user_id}</p>
      </>
    )}
   
    </>
  )
}

export default Profile