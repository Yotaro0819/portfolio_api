import React, { useContext, useEffect, useState } from 'react'
import axiosInstance from '../../api/axios'
import { AppContext } from '../../Context/AppContext';
import { Link } from 'react-router-dom';

const OngoingOrders = () => {
  const { authUser } = useContext(AppContext);
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
      <div className="text-center mt-20">Loading...</div>
    ) 
    :
    (
      <div className="w-5/6 mx-auto">
        <div className="flex mb-2">
        <Link to={"/ongoing-orders"} className="text-4xl mt-8 mr-7 border-b">Ongoing Orders</Link>
        <Link to={"/purchase-history"} className="text-2xl mt-10 mr-6">Purchase History</Link>
        <Link to={"/sales-history"} className="text-2xl mt-10">Sales History</Link>  
        </div>

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
                <>
                {order.process_status == 'pending' ? (
                  <div className="flex py-2 border" key={order.id}>
                  <p className="w-20 text-center">{order.id}</p>
                  <p className="w-64 text-center">{order.payment_id}</p>
                  <p className="w-40 text-center">{order.payer.name}</p>
                  <p className="w-72 text-center">{order.product_name}</p>
                    { authUser.user_id == order.seller_id ? (
                    <button 
                    onClick={() => {handleApprove(order.payment_id)}}
                    className="btn bg-blue-500 px-2 rounded mr-5"
                    >Approve
                    </button>
                    ) : (
                    <div className="mr-4">Wait for approval</div>
                    )}

                  <button 
                  onClick={() => {handleCancel(order.payment_id)}}
                  className="btn bg-red-400 px-2 rounded mr-5">Cancel
                  </button>
                  </div>
                ) 
                :
                (
                  <>
                  { authUser.user_id == order.payer_id ? (
                  <div className="flex py-2 border" key={order.id}>
                    <p className="w-20 text-center">{order.id}</p>
                    <p className="w-64 text-center">{order.payment_id}</p>
                    <p className="w-40 text-center">{order.payer.name}</p>
                    <p className="w-72 text-center">{order.product_name}</p>
                    <p className="mr-4">Confirm</p>

                    <button 
                    onClick={() => {handleCancel(order.payment_id)}}
                    className="btn bg-red-400 px-2 rounded mr-5">Cancel
                    </button>
                  </div>
                  ) 
                  :
                  (
                    <></>
                  )}
                  </>
                )}
                </>
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