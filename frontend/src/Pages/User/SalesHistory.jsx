import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axios';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  console.log(sales);
  useEffect(() => {
    const fetchSales = async() => {
      try {
        const res = await axiosInstance('/api/get-sales');
        console.log(res.data);
        setSales(res.data.sales);
      } catch (error) {
        console.error('Failed to fetch Sales: ', error);
      }
    }
    fetchSales();
  }, [])
  return (
    <div className="w-5/6 mx-auto">
        <div className="flex mb-2">
        <Link to={"/ongoing-orders"} className="text-2xl mt-10 mr-6">Ongoing Orders</Link>
        <Link to={"/purchase-history"} className="text-2xl mt-10 mr-8">Purchase History</Link>
        <Link to={"/sales-history"} className="text-4xl mt-8 border-b">Sales History</Link>  
        </div>
      <div className="border border-white w-full bg-gray-400">
        <div className="flex">
          <p className="w-40 text-center">Customer Name</p>
          <p className="w-64 text-center">Order ID</p>
          <p className="w-72 text-center">Item Name</p>
          <p className="w-52 text-center">Post Price</p>
        </div>
        {sales ? (
          <div className="overflow-auto h-5/6">
            {sales.map((sale) => {
              return (
              <div key={sale.id}>
                <div className="flex py-2 border">
                  <p className="w-40 text-center">{sale.payer.name}</p>
                  <p className="w-64 text-center">{sale.payment_id}</p>
                  <p className="w-72 text-center">{sale.product_name}</p>
                  <p className="w-52 text-center">{sale.amount}</p>
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

export default SalesHistory