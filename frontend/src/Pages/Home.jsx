import React, { useContext, useEffect, useRef, useState } from 'react'
import '../styles/Home.css';
import { AppContext } from '../Context/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios.js';
import RightSideProfile from '../Component/RightSideProfile.jsx';
import LikeButton from '../Component/LikeButton.jsx';
import SearchBar from '../Component/SearchBar.jsx';
import dayjs from 'dayjs';
import { useInView } from "react-intersection-observer";
import Masonry from "masonry-layout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const { authUser, setShowNav } = useContext(AppContext);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const { ref, inView } = useInView({});
  const [link, setLink] = useState(null);
  const gridRef = useRef(null);
  const masonryRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if(location.state?.deleted) {
      toast.success('Your post deleted', {
        position: "top-right",
        autoClose: 1500,
      })
      navigate("/", { replace: true, state: {} });
    }
  }, [location, navigate])

  useEffect(() => {
    if (gridRef.current) {
      masonryRef.current = new Masonry(gridRef.current, {
        itemSelector: ".masonry-item",
        columnWidth: ".masonry-item",
        percentPosition: true, 
        gutter: 0,
      });
    }
  }, [allPosts]);

  useEffect(() => {
    if (masonryRef.current) {
      setTimeout(() => {
        masonryRef.current.layout();
      }, 100); // 遅延させてレイアウトを再計算
    }
  }, [showProfile]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const res = await axiosInstance('/api/posts');
  //       console.log(res.data);
  //       setAllPosts(res.data.data);
  //       setLink(res.data.next_page_url);
  //       setLoading(false);
  //     } catch (error) {
  //       setError(error);
  //       setLoading(false);  
  //     }
  //   };

  //   fetchPosts();
  //   setShowNav(true);
  // },[]);

  useEffect(() => {
    if(inView && link) {
      axiosInstance.get(link).then((res) => {
        console.log(res.data);
        setAllPosts((prevPosts) => {
          const newPosts = res.data.data.filter(
            (newPost) => !prevPosts.some((post) => post.id === newPost.id)
          );
          return [...prevPosts, ...newPosts];
        });
        setLink(res.data.next_page_url);
      })
    }
  }, [inView]);

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
          <div className="masonry-grid" ref={gridRef}>
            {allPosts.map((post) => 
            ( 
              <div key={post.id} className="masonry-item"> 
                <Link to={{
                  pathname: `/post/${post.id}`,
                  state: {post}
                  }}>
                <img className="h-auto" src={post.image} alt="post_image"/>
                </Link>
                <LikeButton 
                postId={ post.id } 
                isLiked={ post.isLiked } 
                likeCount={ post.like_count } 
                addClass={ "absolute bottom-2" }
                />
                <p className="mr-4 absolute bottom-2 right-1">{dayjs(post.created_at).format("YYYY/MM/DD HH:mm")}</p>
              </div>
            ))}
          </div>
          <div ref={ref}><p className="text-center p-4 text-2xl mb-20">No more posts...</p></div>
          </div>
          )}
        </div>
        <div className="relative">
        <button 
          onClick={() => setShowProfile(!showProfile)} 

        >
          <div>{showProfile ? <p className="p-2 bg-gray-800 rounded-l-lg">Hide Profile</p> : <p className="p-2 text-center rounded-l-lg bg-gray-800">Show Profile</p>}</div>
        </button>
        </div>
        {showProfile && <RightSideProfile authUser={authUser} />}
      </div>
    </>
  );
}

