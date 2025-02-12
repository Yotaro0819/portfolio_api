import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';


const RightSideProfile = ({authUser}) => {
const [counts, setCounts] = useState(null);

  useEffect(() => {
     const countFollows = async () => {
          try {
            const res = await axiosInstance.get(`/api/count-follows/${authUser.user_id}`, {
              withCredentials: true
            })
            console.log(res.data);
            setCounts(res.data);
          } catch (error) {
            console.error('failed fatching counts: ', error);
          }
        }
        countFollows();
  },[]);

  return (
            <div className="profile-right">
              <div className="userInfo bg-black">
                  
    
                  { counts ? (
                    <>
                    <div className="avatar flex items-center">
                      <Link to={`/profile/${authUser.user_id}`}>
                        {authUser.image ? 
                        <img src="#" alt="avatar"></img>
                        :
                        <i className="fa-solid fa-user inline"></i>
                        }
                      </Link>
                    </div>
                    <div className="ml-2">
                      <h3 className="username inline mt-2">{authUser.name}</h3>
                        <div>
                          <Link to="/follower" className="mr-4">Follower { counts.followerCount }</Link>
                          <Link to="/following">Following { counts.followingCount }</Link>
                        </div>
                    </div>
                  </>

                  ):(
    
                    <></>
                  )}
              </div>
            </div>
  )
}

export default RightSideProfile