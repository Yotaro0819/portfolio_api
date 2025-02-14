import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';

const PostList = ({id, imageSize, grid}) => {

  const [posts, setPosts] = useState(null);


  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axiosInstance.get(`/api/my-posts/${id}`);
        
        console.log(res.data);
        setPosts(res.data);
      } catch (error) {
        console.error('failed fetching auth posts: ', error);
      }
    }
    getPost();
  },[id])
  return (
    <div className="contrast-less">
      { posts && posts.length > 0 ? 
      (
        <div className={`grid ${grid}`}>
        {posts.map((post) => (
          <div key={post.id} className="your-posts">
            <Link to={`/post/${post.id}`}>
            <img 
              src={post.image} 
              alt="post_image"
              className={`object-cover bg-center ${imageSize}`}
                    />
            </Link>
        </div>
        ))}
        </div>
      ) 
      :
      (
        <div className="text-xl text-center">No posts.</div>
      )}
    </div>
  )
}

export default PostList