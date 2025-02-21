import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axios'
import dayjs from "dayjs";


const Index = () => {
  const [users, setUsers] = useState();
  
  useEffect(() => {
    const fetchUserMessages = async() => {
      try {
        const res = await axiosInstance('/api/messages/index');
        console.log(res.data);
        setUsers(res.data);
      } catch (error) {
        console.error('failed fetching messages: ', error);
      }
    }
    fetchUserMessages();
  }, [])
  

  return (
    <div className="fb">
      <div className="w-5/6 h-screen">
        <p className="title">Messages</p>
        <div className="bg-black w-3/4 mx-auto h-5/6 rounded">
          <div className="m-3">
            <p>Search</p>
            <input type="text" placeholder="search User" className="text-black px-2" />
          </div>
          <div className="px-5 bg-gray-800 h-5/6 max-h-full overflow-auto scrollbar-none">
          {users ? (
             users.map((user) => 
              (
              <Link to={`/messages/show/${user.id}`} key={user.id}>
                <div className="border rounded p-2 px-4 m-1 my-4 bg-gray-500 h-24">
                  <p>{user.name}</p>
                  <p>{user.latest_message?.content || "no messages"}</p>
                  <p className="text-right">{user.latest_message?.created_at ? dayjs(user.latest_message.created_at).format("YYYY/MM/DD HH:mm") : ""}</p>

                </div>
              </Link>
            ))
          ) 
          :
          (
            <>loading...</>
          )}
          </div>
        </div>
      </div>
      <div className="w-1/3 bg-red-500">hello</div>
    </div>

  )
}

export default Index