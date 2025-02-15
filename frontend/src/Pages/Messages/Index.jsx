import React from 'react'
import { Link } from 'react-router-dom'

const Index = () => {

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
          <Link to={"/messages/show/1"}>
            <div className="border p-5 m-1 bg-gray-500">
              <p>userName</p>
              <p>text messages</p>
            </div>
          </Link>
          <Link to={"/messages/show/2"}>
            <div className="border p-5 m-1 bg-gray-500">
              <p>userName</p>
              <p>text messages</p>
            </div>
          </Link>
          <Link>
            <div className="border p-5 m-1 bg-gray-500">
              <p>userName</p>
              <p>text messages</p>
            </div>
          </Link>
          <Link>
            <div className="border p-5 m-1 bg-gray-500">
              <p>userName</p>
              <p>text messages</p>
            </div>
          </Link>
          <Link>
            <div className="border p-5 m-1 bg-gray-500">
              <p>userName</p>
              <p>text messages</p>
            </div>
          </Link>
          <Link>
            <div className="border p-5 m-1 bg-gray-500">
              <p>userName</p>
              <p>text messages</p>
            </div>
          </Link>
          <Link>
            <div className="border p-5 m-1 bg-gray-500">
              <p>userName</p>
              <p>text messages</p>
            </div>
          </Link>
          </div>
        </div>
      </div>
      <div className="w-1/3 bg-red-500">hello</div>
    </div>

  )
}

export default Index