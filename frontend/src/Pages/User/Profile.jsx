import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context/AppContext';
import '../../styles/Profile.css';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import OwnPostList from '../../Component/OwnPostList';
import PostList from '../../Component/PostList';
import LikePostList from '../../Component/LikePostList';

const Profile = () => {
const { user } = useContext(AppContext);
const [counts, setCounts] = useState(null);
const [activeTab, setActiveTab] = useState("post");

  useEffect(() => {
    const countFollows = async () => {
      try {
        const res = await axiosInstance.get('/api/count-follows', {
          withCredentials: true
        })
        console.log(res.data);
        setCounts(res.data);
      } catch (error) {
        console.error('failed fatching counts: ', error);
      }
    }
    countFollows();
  },[]) 


  return (
    <>
    {!user ? (
      <div></div>
    )
    :
    (
      <>
      {/* <div>Profile</div> */}
      <div className="fb">
        <div className="box">
          <div className="userInfo w-0.75 m-userInfo-l-300">
              <div className="text-8xl flex items-center ">
                {user.image ? 
                  <img src="#" alt="avatar"></img>
                    :
                  <i className="fa-solid fa-user inline mx-10"></i>
                }
              </div>
              <div>
                <div className="flex">
                    <p className="text-2xl ml-9">{user.name}</p>
                    <Link className="mx-10 p-1 px-6 bg-gray-500 rounded-md">Edit</Link>
                </div>
                {counts ? (
                  <div className="ml-9 my-4">
                  <p className="text-xl inline">Posts</p>
                  <Link to={'/follower'} className="ml-5 text-xl">Follower {counts.followerCount}</Link>
                  <Link to={'/following'} className="ml-5 text-xl">Following {counts.followingCount}</Link>
                </div>
                ) 
                :
                (
                  <>Loading...</>
                )}
              </div>
              
              
             
            </div>
            <div className="profile-contents w-3/4 mx-auto">
                <div className="border-t border-white mt-20">
                  <button
                    className={`left-part text-3xl ml-20 ${activeTab === "post" ? "font-bold" : ""}`}
                    onClick={() => setActiveTab("post")}
                  >
                    Post
                  </button>
                  <button
                    className={`text-3xl ml-20 ${activeTab === "like" ? "font-bold" : ""}`}
                    onClick={() => setActiveTab("like")}
                  >
                    Like Post
                  </button>
                  <button
                    className={`text-3xl  ml-20 ${activeTab === "own" ? "font-bold" : ""}`}
                    onClick={() => setActiveTab("own")}
                  >
                    Own Post
                  </button>
                </div>
                <div className="mt-10 p-4">
                  {activeTab === "post" && <PostList />}
                  {activeTab === "like" && <LikePostList />}
                  {activeTab === "own" && <OwnPostList />}
                </div>
            </div>
          </div>
        
      </div>


      
      </>
    )}
   
    </>
  )
}

export default Profile