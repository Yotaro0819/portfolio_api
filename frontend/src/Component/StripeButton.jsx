import React, { useState } from 'react'
import axiosInstance from '../api/axios';

const StripeButton = ({sellerId, title, price}) => {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/api/stripe/create-order/${sellerId}`, {
        title,
        price,
      });
      if(res.data.url) {
        window.location.href = res.data.checkout_url;
      } else {
        alert("Error: Could not get payment URL");
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert("Error processing payment");
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
    onClick={handleClick}
    disabled={loading}
    style={{
      backgroundColor: loading ? '#ccc' : '#6772e5',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: '16px'
    }}
    >
      {loading ? 'Processing...' : 'Pay with Stripe'}
    </button>
  )
}

export default StripeButton