import React, { useState } from 'react'
import axiosInstance from '../../api/axios'
import { useParams } from 'react-router-dom';

const Show = () => {
  const [message, setMessage] = useState('');
  const { user_id } = useParams();


  const handleMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert('Message cannot be empty');
      return;
    }

    try {
      const res = await axiosInstance.post(`/api/messages/store/${user_id}`, {
        content: message,
      });

      console.log('Message sent successfully:', res.data);
      setMessage(''); 
      
    } catch (error) {
      console.error('Failed to send message: ', error);
    }
  }
  return (
    <div className="fb">
      <div className="w-5/6 h-screen">
      <p className="title">Messages</p>
        <div className="bg-black w-3/4 mx-auto h-5/6 rounded">
          <div className="m-3">
            <p>Search</p>
            <input type="text" placeholder="search User" className="text-black px-2" />
          </div>
          <div className="px-5 bg-gray-800 h-500px overflow-auto scrollbar-none">
          </div>
          <form onSubmit={handleMessage} className="relative w-11/12 mx-auto">
            <textarea 
            className="block w-full p-2 border rounded-md resize-none bg-gray-700" 
            value={message}
            onChange={(e) => {setMessage(e.target.value)}}
            placeholder="Send your message..."
            ></textarea>
            <div className="flex justify-end mt-2">
              <button 
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded-md">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-1/3 bg-red-500">hello</div>
    </div>
  )
}

export default Show