import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axios'

const OngoingOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/api/get-orders');
        console.log(res.data);
        setOrders(res.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders: ', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  },[])

  const handleApprove = async (paymentId) => {
    try {
      const res = await axiosInstance.patch(`/api/stripe/${paymentId}/approve`);
      console.log(res.data);
    } catch (error) {
      console.error('Failed to approve the order: ', error);
    }
  }

  const handleCancel = async (paymentId) => {
    try {
      const res = await axiosInstance.post(`/api/stripe/${paymentId}/cancel`);
      console.log(res.data);
    } catch (error) {
      console.error('Failed to cancel the order: ', error);
    }
  }

  return (
    <>
    {isLoading ? (
      <div>Loading...</div>
    ) 
    :
    (
      <div>
        <p>OngoingOrders</p>
        {orders.map((order) => {
          return (
            <div key={order.id}>
            <p>{order.id}</p>
            <button 
            onClick={() => {handleApprove(order.payment_id)}}
            className="btn bg-blue-500 px-2 rounded"
            >Approve</button>
            <button 
            onClick={() => {handleCancel(order.payment_id)}}
            className="btn bg-red-400 px-2 rounded">Cancel</button>
            </div>
          )
        })}
      </div>
    )}
    </>
  )
}

export default OngoingOrders