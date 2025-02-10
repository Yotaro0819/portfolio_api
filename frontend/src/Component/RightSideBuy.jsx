import React from 'react'
import PayPalButton from './PayPalButton';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
const RightSideBuy = ( {post, user, setMessage, config} ) => {

  return (
    <div className="right bg-gray-800">
            <div>
              <p className="show-body">{ post.body }</p>
              <p className="price">{ post.price }</p>
            </div>

              { post.user_id !== user.user_id ? (
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