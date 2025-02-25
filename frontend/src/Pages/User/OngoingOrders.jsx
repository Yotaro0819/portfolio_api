import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axios'

const OngoingOrders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetchOrders();
  },[])

  //approveかcancel後再度fetchOrdersを呼び出せるように外に出しています
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

  const handleApprove = async (paymentId) => {
    try {
      const res = await axiosInstance.patch(`/api/stripe/${paymentId}/approve`);
      console.log(res.data);
      fetchOrders();
    } catch (error) {
      console.error('Failed to approve the order: ', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = async (paymentId) => {
    try {
      const res = await axiosInstance.post(`/api/stripe/${paymentId}/cancel`);
      console.log(res.data);
      fetchOrders();
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
      <div className="w-5/6 mx-auto">
        <p className="text-2xl mt-10">OngoingOrders</p>

          <div className="border border-white w-full bg-gray-400">
            <div className="flex">
              <p className="w-20 text-center">Order ID</p>
              <p className="w-64 text-center">Customer Name</p>
              <p className="w-40 text-center">Order ID</p>
              <p className="w-72 text-center">Item Name</p>
            </div>
            <div className="overflow-auto h-5/6">
          {orders ? (
            orders.map((order) => {
              return (
                    <div className="flex py-2 border" key={order.id}>
                      <p className="w-20 text-center">{order.id}</p>
                      <p className="w-64 text-center">{order.payment_id}</p>
                      <p className="w-40 text-center">{order.payer.name}</p>
                      <p className="w-72 text-center">{order.product_name}</p>
                      <button 
                      onClick={() => {handleApprove(order.payment_id)}}
                      className="btn bg-blue-500 px-2 rounded mr-5"
                      >Approve
                      </button>
                      <button 
                      onClick={() => {handleCancel(order.payment_id)}}
                      className="btn bg-red-400 px-2 rounded mr-5">Cancel
                      </button>
                    </div>
              )
            })
          ) : (
            <>No orders found.</>
          )}
        </div>
        </div>

      </div>
    )}
    </>
  )
}

export default OngoingOrders