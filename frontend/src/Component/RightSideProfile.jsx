import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';


const RightSideProfile = ({authUser}) => {
const [counts, setCounts] = useState(null);
const [avatar, setAvatar] = useState(null);

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

      const fetchAvatar = async() => {
        try {
          const res = await axiosInstance('/api/get-avatar');
          console.log(res.data);
          setAvatar(res.data);
        } catch (error) {
          console.error('failed fetching your avatar: ', error);
        }
      }

        countFollows();
        fetchAvatar();
  },[]);

  return (
            <div className="profile-right">
              <div className="userInfo bg-black">
                  
    
                  { counts ? (
                    <>
                    <div className="avatar flex items-center">
                      <Link to={`/profile/${authUser.user_id}`}>
                        {avatar ? 
                        <img 
                        src={avatar} 
                        alt="avatar"
                        className="w-24 h-24 rounded-full object-cover p-2"
                        ></img>
                        :
                        <i className="fa-solid fa-user w-20 h-20 flex rounded-full ml-4"></i>
                        }
                      </Link>
                    </div>
                    <div className="ml-2">
                      <h3 className="username inline mt-2">{authUser.name}</h3>
                        <div>
                          <Link to={`/follower/${authUser.user_id}`} className="mr-4">Follower { counts.followerCount }</Link>
                          <Link to={`/following/${authUser.user_id}`}>Following { counts.followingCount }</Link>
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