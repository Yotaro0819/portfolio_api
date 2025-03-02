import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axios'


const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);

  console.log(purchases);
  useEffect(() => {
    const fetchPurchases = async() => {
      try {
        const res = await axiosInstance('/api/get-purchases');
        console.log(res.data);  
        setPurchases(res.data.purchases);
      } catch (error) {
        console.error('Failed to fetch purchases: ', error);
      }
    }
    fetchPurchases();
  }, []);
  
  return (
    <div className="w-5/6 mx-auto">
        <div className="flex mb-2">
        <Link to={"/ongoing-orders"} className="text-2xl mt-10 mr-6">Ongoing Orders</Link>
        <Link to={"/purchase-history"} className="text-4xl mt-8 mr-6 border-b">Purchase History</Link>
        <Link to={"/sales-history"} className="text-2xl mt-10">Sales History</Link>  
        </div>

          <div className="border border-white w-full bg-gray-400">
          <div className="flex">
              <p className="w-40 text-center">Seller Name</p>
              <p className="w-64 text-center">Order ID</p>
              <p className="w-72 text-center">Item Name</p>
              <p className="w-52 text-center">Post Price</p>
            </div>
            {purchases ? (
              <div className="overflow-auto h-5/6">
                {purchases.map((purchase) => {
                  return (
                    <div key={purchase.id}>
                      <div className="flex py-2 border">
                      <p className="w-40 text-center">{purchase.seller.name}</p>
                      <p className="w-64 text-center">{purchase.payment_id}</p>
                      <p className="w-72 text-center">{purchase.product_name}</p>
                      <p className="w-52 text-center">{purchase.amount}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) 
            :
            (
              <>loading...</>
            )}
            
            
          </div>
    </div>
  )
}

export default PurchaseHistory