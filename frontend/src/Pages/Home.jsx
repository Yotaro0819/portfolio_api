import React, { useContext, useEffect, useState } from 'react'
import '../styles/Home.css';
import { AppContext } from '../Context/AppContext';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios.js';
import RightSideProfile from '../Component/RightSideProfile.jsx';


export default function Home() {
  const { user, setShowNav } = useContext(AppContext);
  const [allPosts, setAllPosts] = useState([]);
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(allPosts);
  console.log(user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get('/api/posts');

       console.log(res.data);

        setAllPosts(res.data.posts);
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
          <h1 className="title">All Posts</h1>
          { loading ? (
            <div className="text-center">Loading...</div>
          ) 
          : error ? (
            <div>Error: {error.message }</div>
          )
          :
          (
          <ul>
            {allPosts.map((post) => 
            ( 
              <li key={post.id}>
                <div className="each-post bg-gray-800">
                  <Link to={`/post/${post.id}`}>
                  <div className="card-body block post-title px-1 text-white bg-gray-800 mt-0">
                    <div className="flex items-center">
                    <h2 className="post-title"> {post.title }</h2>
                    <h2>{post.user.name}</h2>
                    </div>
                  </div>
                  <div className="block px-1 bg-gray-800 mt-0">
                    <img 
                    src={post.image} 
                    alt="post_image"
                    className="mt-2 img object-cover border border-gray-300" 
                    />
                  </div>
                  </Link>
                  <div className="body">
                  <p className="mt-1">{ post.body }</p>

                  </div>
                  <div className="flex">
                  <i className="fa-regular fa-heart"></i>
                  <p className="date">{ post.created_at }</p>

                  </div>
                </div>
                
              </li>
            ))}
          </ul>
          )}
        </div>
      
        <RightSideProfile user={user} />
      </div>
    </>
  );
}

