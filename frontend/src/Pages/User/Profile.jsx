import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context/AppContext';

import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import OwnPostList from '../../Component/OwnPostList';
import PostList from '../../Component/PostList';
import LikePostList from '../../Component/LikePostList';

const Profile = () => {
  const { authUser } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState(null);
  const [activeTab, setActiveTab] = useState("post");
  const { user_id } = useParams();//ここのuseParamはApp.jsxに記載したrouteのparamと同じ名前にする必要がある。

  console.log(user)
  console.log(user_id)

  useEffect(() => {

    const countFollows = async () => {
      try {
        const res = await axiosInstance(`/api/count-follows/${user_id}`);
        console.log(res.data);
        setCounts(res.data);
      } catch (error) {
        console.error('failed fetching counts: ', error);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axiosInstance(`/api/user-info/${user_id}`);
        console.log(res.data);
        setUser(res.data);
      } catch (error) {
        console.error('failed fetching user data: ', error);
      }
    };

    countFollows();
    fetchUser();
  }, []); // location が変更されたときにデータを再取得

  return (
    <>
      {!user ? (
        <>
        </>
      ) : (
        <>
          <div className="fb mt-20">
            <div className="box">
              <div className="userInfo w-0.75 justify-center">
                <div className="text-8xl flex items-center ">
                  {user.avatar ? (
                    <img 
                    src={user.avatar} 
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <i className="fa-solid fa-user mx-10 w-24 h-24"></i>
                  )}
                </div>
                <div className="mr-20">
                  <div className="flex">
                    <p className="text-2xl ml-9">{user.name}</p>
                    { user.id == authUser.user_id ? (
                      <Link
                      to={'/edit-profile'}
                      className="mx-10 p-1 px-6 bg-gray-500 rounded-md"
                    >
                      Edit
                    </Link>
                    )
                    :
                    (
                    <></>
                    ) }
                    
                  </div>
                  {counts ? (
                    <div className="ml-9 my-4 w-">
                      <p className="text-xl inline">Posts</p>
                      <Link to={`/follower/${user.id}`} className="ml-5 text-xl">
                        Follower {counts.followerCount}
                      </Link>
                      <Link to={`/following/${user.id}`} className="ml-5 text-xl">
                        Following {counts.followingCount}
                      </Link>
                    </div>
                  ) : (
                    <>Loading...</>
                  )}
                </div>
              </div>
              <div className="w-1/2 mx-auto p-3 h-24">
              <p className="text-xl">{user.bio}</p>
              </div>
              <div className="profile-contents w-3/4 mx-auto">
                <div className="border-t border-white mt-10 mx-auto flex justify-center">
                  <button
                    className={`text-3xl mt-10 ${activeTab === 'post' ? 'font-bold' : ''}`}
                    onClick={() => setActiveTab('post')}
                  >
                    Post
                  </button>
                  <button
                    className={`text-3xl ml-20 mt-10 ${activeTab === 'like' ? 'font-bold' : ''}`}
                    onClick={() => setActiveTab('like')}
                  >
                    Like Post
                  </button>
                  <button
                    className={`text-3xl ml-20 mt-10 ${activeTab === 'own' ? 'font-bold' : ''}`}
                    onClick={() => setActiveTab('own')}
                  >
                    Own Post
                  </button>
                </div>
                <div className="mt-10 p-4">
                  {activeTab === 'post' && <PostList id={user_id} imageSize="w-64 h-64" grid="grid-cols-4"/>}
                  {activeTab === 'like' && <LikePostList id={user_id} />}
                  {activeTab === 'own' && <OwnPostList id={user_id} />}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
