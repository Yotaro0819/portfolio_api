import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import '../../styles/Show.css';
import RightSideBuy from '../../Component/RightSideBuy';
import { AppContext } from '../../Context/AppContext';
import axiosInstance from '../../api/axios';


const Show = () => {
  const { config, user } = useContext(AppContext);
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  console.log(post_id)


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/api/posts/${post_id}`, {
          withCredentils: true,
        })
        console.log(res.data);
        setPost(res.data);
      } catch (error) {
        console.error('failed fetching post: ', error);
      }
    }

    fetchPost();
  },[])
 
  return (
    <>
    {!config ? 
      (
        <div>loading...</div>
      )
      : 
      (
      <div>
        {post ? (
          <>
              {message && (
                  <div className="overlay">
                    <div className="message">
                      {message}
                    </div>
                  </div>
                )}
          <div className="fb">
            <div className="box">
              <div className="content">
                <h2 className="title">Details of the post</h2>
                  <div className="post-showing bg-gray-800">
                    <p className="post-title post-show">{post.title}</p>
                      <div className="block px-1 bg-gray-800 mt-0">
                      <img 
                      src={post.image} 
                      alt="post_image"
                      className="post-image mt-2 img object-cover border border-gray-300" 
                      />
                      </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                      
                  </div>
              </div>
            </div>
            

            <RightSideBuy className="show-body" post={post} user={user} setMessage={setMessage} config={config}/>
        </div>
                    
          </>
        ) : (
          <>loading post info...</>
        )}
      </div>
      )
     }
    </>

  )
}

export default Show