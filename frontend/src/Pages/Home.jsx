import React, { useContext, useEffect, useState } from 'react'
import '../styles/Home.css';

import { AppContext } from '../Context/AppContext';


export default function Home() {
  const { setShowNav } = useContext(AppContext);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(allPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts', {
          credentials: 'include',
        });

        if(!res.ok) {
          throw new Error('response was not ok');
        }

        const data = await res.json();

        const updatedPosts = data.map(post => {
          post.image = `http://127.0.0.1:8000/storage/${post.image}`;
          return post;
        });

        setAllPosts(updatedPosts);
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
      <div className="box">
        <h1>All Posts</h1>
        { loading ? (
          <div>Loading...</div>
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
              <div className="card bg-gray-800">

                <div className="card-body block post-title px-1 text-white bg-gray-800 mt-0">
                <h2> {post.title }</h2>
                </div>
                <div className="block px-1 bg-gray-800 mt-0">
                  <img 
                  src={post.image} 
                  alt="post_image"
                  className="mt-2 img object-cover border border-gray-300" 
                  />
                </div>
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
    </>
  );
}

