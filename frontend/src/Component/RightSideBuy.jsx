import React from 'react'
import PayPalButton from './PayPalButton';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Link } from 'react-router-dom';

const RightSideBuy = ( {post, authUser, setMessage, config} ) => {
  console.log(post);
  return (
    <div className="right bg-gray-800">
            <div className="avatar flex items-center">
                      <Link to={`/profile/${post.user_id}`}>
                        {authUser.image ? 
                        <img src="#" alt="avatar"></img>
                        :
                        <i className="fa-solid fa-user inline"></i>
                        }
                      </Link>
          </div>
            <div>
              <p className="show-body">{ post.body }</p>
              <p className="price">{ post.price }</p>
            </div>

              { post.user_id !== authUser.user_id ? (
                <div className="paypal-btn">
                  <PayPalScriptProvider options={{ "client-id": config.client_id, currency: "JPY" }}>
                    <PayPalButton config={config} post={post} setMessage={setMessage}/>
                  </PayPalScriptProvider>
              </div>
            ) : (
              <div>
                <p>Your post</p>
              </div>
            )}
            
          </div>
  )
}

export default RightSideBuy