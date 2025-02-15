import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axios'

const Index = () => {
  const [messages, setMessages] = useState();
  
  useEffect(() => {
    const fetchUserMessages = async() => {
      try {
        const res = await axiosInstance('/api/messages/index');
        console.log(res.data);
        setMessages(res.data);
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
          {messages ? (
             messages.map((message) => (
              <Link to={`/messages/show/${message.id}`} key={message.id}>
                <div className="border p-5 m-1 bg-gray-500">
                  <p>{message.name}</p>
                  <p>{message.latest_message?.content || "no message"}</p>
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