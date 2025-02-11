import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';

const PostList = () => {

  const [authPosts, setAuthPosts] = useState(null);

  useEffect(() => {
    const getAuthPost = async () => {
      try {
        const res = await axiosInstance.get('/api/auth-posts');
        
        console.log(res.data);
        setAuthPosts(res.data);
      } catch (error) {
        console.error('failed fetching auth posts: ', error);
      }
    }
    getAuthPost();
  },[])
  return (
    <div className="contrast-less">
      { authPosts ? 
      (
        <div className="grid grid-cols-4">
        {authPosts.map((post) => (
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
        <></>
      )}
    </div>
  )
}

export default PostList