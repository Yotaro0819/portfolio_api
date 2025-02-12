import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';

const PostList = ({id}) => {

  const [authPosts, setAuthPosts] = useState(null);


  useEffect(() => {
    const getAuthPost = async () => {
      try {
        const res = await axiosInstance.get(`/api/my-posts/${id}`);
        
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
        <div className="text-center text-4xl mr-10"></div>
      )}
    </div>
  )
}

export default PostList