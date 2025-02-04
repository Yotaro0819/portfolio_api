import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Profile = () => {

  const [authUser, setAuthUser] = useState(null);

useEffect(() => {

  const fetchUser = async () =>  {

    try {
      const res = await axios.get('/api/check-auth', {
        withCredentials: true,
      });

      console.log('Getting user data successfully:', res.data);

      setAuthUser(res.data.user);
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }

  }
  fetchUser();
}, [])


  return (
    <>
    {!authUser ? (
      <div></div>
    )
    :
    (
      <>
      <div>Profile</div>
      <p>{authUser.name}</p>
      <p>{authUser.password}</p>
      </>
    )}
   
    </>
  )
}

export default Profile