import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Show.css';
import PayPalButton from '../../Component/PayPalButton';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { AppContext } from '../../Context/AppContext';


const Show = () => {
  const { config, user } = useContext(AppContext);
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(post_id)


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${post_id}`, {
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
          <div className="fb">
            <div className="box">
              <div className="content">
                <h2 className="title">Details of the post</h2>
                  <div className="post bg-gray-800">
                    <p className="post-title post-show">{post.title}</p>
                      <div className="block px-1 bg-gray-800 mt-0">
                      <img 
                      src={post.image} 
                      alt="post_image"
                      className="mt-2 img object-cover border border-gray-300" 
                      />
                      </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                      
                  </div>
              </div>
            </div>
            
          <div className="right bg-gray-800">
            <div className="post-body">
              <p className="show-body">{ post.body }</p>
              <p className="price">{ post.price }</p>
            </div>

            { post.user_id !== user.user_id ? (
              <div className="paypal-btn">
                <PayPalScriptProvider options={{ "client-id": config.client_id, currency: "JPY" }}>
                  <PayPalButton config={config} post={post} />
                </PayPalScriptProvider>
            </div>
            ) : (
              <div>
                <p>Your post</p>
              </div>
            )}
            
          </div>
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