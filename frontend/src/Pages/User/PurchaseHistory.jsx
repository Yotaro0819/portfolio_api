import React from 'react'
import { Link } from 'react-router-dom'

const PurchaseHistory = () => {
  return (
    <div className="w-5/6 mx-auto">
        <div className="flex mb-2">
        <Link to={"/ongoing-orders"} className="text-2xl mt-10 mr-6">Ongoing Orders</Link>
        <Link to={"/purchase-history"} className="text-4xl mt-8 mr-6 border-b">Purchase History</Link>
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
            </div>
          </div>
    </div>
  )
}

export default PurchaseHistory