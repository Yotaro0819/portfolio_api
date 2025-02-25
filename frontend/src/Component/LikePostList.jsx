import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';

const LikePostList = ({id}) => {
  const [likePosts, setLikePosts] = useState(null);

  useEffect(() => {
    const fetchLikePosts = async () => {
      try {
        const res = await axiosInstance(`/api/like-posts/${id}`);

        console.log(res.data);
        setLikePosts(res.data);
      } catch(error) {
        console.error('failed fetching like posts: ', error);
      }
    }
    fetchLikePosts();
  },[])
  return (
    <div className="contrast-less">
    { likePosts ? 
    (
      <div className="grid grid-cols-4">
      {likePosts.map((post) => (
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

export default LikePostList