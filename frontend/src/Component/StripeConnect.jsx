import React, { useContext, useState } from 'react'
import axiosInstance from '../api/axios';
import { AppContext } from '../Context/AppContext';

const StripeConnect = () => {
  const { authUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/api/stripe/connect-account/${authUser.user_id}`);
      console.log(res.data);
      window.location.href = res.data.url;
    } catch (error) {
      console.error('Failed to connect to Stripe: ', error);
    }
  }
  return (
    <div className="flex justify-center items-center mt-4">
      {loading ? (
          <div className="overlay">
          <div className="message">
            Loading...
          </div>
        </div>
        ) : (
          <button
            onClick={handleConnect}
            className="px-3 py-1 bg-blue-500 text-white rounded-md mt-4"
          >
            ConnectStripe
          </button>
        )}
    </div>
    // <button onClick={handleConnect} className="block bg-blue-400 px-2 py-2 rounded-md text-sm mt-2 mx-auto w-1/2">
    //   Connect to Stripe
    // </button>
  )
}

export default StripeConnect