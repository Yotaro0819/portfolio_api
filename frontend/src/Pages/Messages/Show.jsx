import React, { useContext, useEffect, useRef, useState } from 'react'
import axiosInstance from '../../api/axios'
import { useParams } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import dayjs from "dayjs";
import RightSideProfile from '../../Component/RightSideProfile';
import Pusher from 'pusher-js';
import axios from 'axios';

const Show = () => {
  const {authUser} = useContext(AppContext);
  const [sendMessage, setSendMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user_id } = useParams();
  const messageEndRef = useRef(null);
  const [pusherKey, setPusherKey] = useState('');
  const [cluster, setCluster] = useState('');
  console.log('pusher info: ',pusherKey, cluster)

  const getMessage = async () => {
    try {
      const res = await axiosInstance(`/api/messages/show/${user_id}`);
      console.log(res.data);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages: ', error);
    }
  }

  useEffect(() => {
    axiosInstance('/api/pusher-key')
    .then((res) => {
      setPusherKey(res.data.key);
      setCluster(res.data.cluster)
      console.log('Pusher info: ', res.data);
    })
    .catch((error) => {
      console.error('Error fetching pusher key: ', error);
    })
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  },[messages])

  useEffect(() => {
    if (!pusherKey || !cluster) return;

    const pusherInstance = new Pusher(pusherKey, {
      cluster: cluster,
      forceTLS: true,
    });

    getMessage();
    
    const channel = pusherInstance.subscribe('public');

    channel.bind('chat', (message) => {
      console.log('received message: ', message);
      if (message.receiver_id == authUser.user_id || message.sender_id == authUser.user_id) {
        // setMessages((prevMessages) => [...prevMessages, message]);
        getMessage();
        scrollToBottom();
      }
      else {
        console.log('something wrong');
      }
    });

    return () => {
      channel.unbind('chat');
      pusherInstance.unsubscribe('public');
      pusherInstance.disconnect();
    };
  }, [pusherKey, cluster, authUser.user_id, user_id]);

  const handleMessage = async (e) => {
    e.preventDefault();

    if (!sendMessage.trim()) {
      alert('Message cannot be empty');
      return;
    }
    try {
      const res = await axiosInstance.post(`/api/broadcast`, {
        message: sendMessage,
        receiver_id: user_id,
        sender_id: authUser.user_id
      });

      console.log('Message sent successfully:', res.data);
      setSendMessage(''); 
      getMessage();
      scrollToBottom();
      
    } catch (error) {
      console.error('Failed to send message: ', error.response?.data);
    }
  }

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth'});
  }


  return (
    <div className="fb">
      <div className="box">
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
              <div ref={messageEndRef} />
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
              className="px-3 py-1 bg-blue-500 text-white rounded-md"
              disabled={!sendMessage.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
      <div><p className="w-20">&nbsp;</p></div>
      <RightSideProfile authUser={authUser} />
    </div>
  )
}

export default Show