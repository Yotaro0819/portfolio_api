import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';

const OwnPostList = ({id}) => {
  const [ownPosts, setOwnPosts] = useState(null);

  useEffect(() => {
    const fetchOwnPosts = async () => {
      try {
        const res = await axiosInstance(`/api/own-posts/${id}`);

        console.log(res.data);
        setOwnPosts(res.data);
      } catch (error) {
        console.error('failed fetching own posts: ', error);
      }
    }
    fetchOwnPosts();
  },[])
  return (
    <div className="contrast-less">
    { ownPosts && ownPosts.length > 0 ? 
    (
      <div className="grid grid-cols-4">
      {ownPosts.map((post) => (
        <div key={post.id} className="your-posts">
          <Link to={`/post/${post.id}`}>
          <img 
            src={post.image} 
            alt="post_image"
            className="image-container w-64 h-64 object-cover bg-center" 
                  />
          </Link>
      
      </div>
      ))}
      
      </div>
    ) 
    :
    (
      <div className="text-center text-4xl mr-10">No posts yet.</div>
    )}
  </div>
  )
}

export default OwnPostList