import React, { useContext, useEffect, useState } from 'react'
import axiosInstance from '../../api/axios'
import { useParams } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import dayjs from "dayjs";

const Show = () => {
  const {authUser} = useContext(AppContext);
  const [sendMessage, setSendMessage] = useState('');
  const [messages, setMessages] = useState('');
  const { user_id } = useParams();

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axiosInstance(`/api/messages/show/${user_id}`);
        console.log(res.data);
        setMessages(res.data);
      } catch (error) {
        console.error('Failed to fetch messages: ', error);
      }
    }
    getMessage();
  }, []);

  const handleMessage = async (e) => {
    e.preventDefault();

    if (!sendMessage.trim()) {
      alert('Message cannot be empty');
      return;
    }
    try {
      const res = await axiosInstance.post(`/api/messages/store/${user_id}`, {
        content: sendMessage,
      });

      console.log('Message sent successfully:', res.data);
      setSendMessage(''); 
      
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
            <p>&nbsp;</p>
          </div>
          <div className="px-1 bg-gray-800 h-500px overflow-auto scrollbar-none">
            {messages ? 
            (
              <>
              {messages.map((message) => {
                return (
                  <div key={message.id}>
                    {message.sender_id == authUser.user_id ? 
                    (
                      <div className="bg-green-200 text-black p-2 m-3 w-3/4 ml-auto rounded-lg">
                        <p className="text-sm">You</p>
                        <p className="text-xl px-4">{message.content}</p>
                        <p className="text-right">{dayjs(message.created_at).format("YYYY/MM/DD HH:mm")}</p>
                      </div>
                    ) 
                    :
                    (
                      <div className="bg-gray-200 text-black p-2 m-3 w-3/4 rounded-lg">
                        <p className="text-sm">{message.sender.name}</p>
                        <p className="text-xl px-4">{message.content}</p>
                        <p className="text-right">{dayjs(message.created_at).format("YYYY/MM/DD HH:mm")}</p>
                      </div>
                    )} 
                  </div>
                )
              })}
              </>
            ) 
            :
            (
              <>Loading...</>
            )
            }
          </div>
          <form onSubmit={handleMessage} className="relative w-11/12 mx-auto">
            <textarea 
            className="block w-full p-2 border rounded-md resize-none bg-gray-700" 
            value={sendMessage}
            onChange={(e) => {setSendMessage(e.target.value)}}
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