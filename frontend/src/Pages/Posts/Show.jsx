import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PayPalButton from '../../Component/PayPalButton';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { AppContext } from '../../Context/AppContext';


const Show = () => {
  const { config } = useContext(AppContext);
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
        <div>loading</div>
      )
      : 
      (
      <div>Show
        {post ? (
          <>
          <p>{post.id}</p>
          <p>{post.title}</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Link to={'payment'}>Payment</Link>
          <div>Payment</div>
                    <PayPalScriptProvider options={{ "client-id": config.client_id, currency: "JPY" }}>
                      <PayPalButton config={config} post={post} />
                    </PayPalScriptProvider>
          </>
        ) : (
          <>loading post info</>
        )}
      
     
      </div>
      )
     }
    </>

  )
}

export default Show