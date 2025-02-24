import React, { useContext, useEffect, useState } from 'react'
import '../styles/Home.css';
import { AppContext } from '../Context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios.js';
import RightSideProfile from '../Component/RightSideProfile.jsx';
import LikeButton from '../Component/LikeButton.jsx';
import SearchBar from '../Component/SearchBar.jsx';
import dayjs from 'dayjs';


export default function Home() {
  const { authUser, setShowNav } = useContext(AppContext);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance('/api/posts');
        console.log(res.data.data);
        setAllPosts(res.data.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);  
      }
    };

    fetchPosts();
    setShowNav(true);
  },[]);

  return (
    <>
      <div className="fb">
        <div className="box">
          <SearchBar setResults={setAllPosts} />
          { loading ? (
            <div className="text-center">Loading...</div>
          ) 
          : error ? (
            <div>Error: {error.message }</div>
          )
          :
          (
          <div className="overflow-auto" style={{height: "825px"}}>
          <div className="flex flex-wrap mt-12">
            {allPosts.map((post) => 
            ( 
              <div key={post.id} className="relative"> 
                <Link to={{
                  pathname: `/post/${post.id}`,
                  state: {post}
                  }}>
                <img className="h-auto" src={post.image} alt="post_image" style={{width: "280px"}}/>
                </Link>
                <LikeButton 
                postId={ post.id } 
                isLiked={ post.isLiked } 
                likeCount={ post.like_count } 
                />
                <p className="mr-4 absolute top-2 right-1">{dayjs(post.created_at).format("YYYY/MM/DD HH:mm")}</p>
              </div>
            ))}
          </div>
          <div>hello</div>
          </div>
          )}
        </div>
        <div className="relative">
        <button 
          onClick={() => setShowProfile(!showProfile)} 
          className="bg-black"
        >
          <div>{showProfile ? <p className="p-2">Hide Profile</p> : <p className="p-2 mr-20 text-left rounded-l-md">Show Profile</p>}</div>
        </button>
        </div>
        {showProfile && <RightSideProfile authUser={authUser} />}
      </div>
    </>
  );
}

