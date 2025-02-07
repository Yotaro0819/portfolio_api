import React, { useContext, useEffect, useState } from 'react'
import '../styles/Home.css';
import { AppContext } from '../Context/AppContext';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function Home() {
  const { user, setShowNav } = useContext(AppContext);
  const [allPosts, setAllPosts] = useState([]);
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(allPosts);
  console.log(user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts', {
          credentials: 'include',
        });

        if(!res.ok) {
          throw new Error('response was not ok');
        }

        const data = await res.json();
        console.log(data);

        setAllPosts(data.posts);
        setLoading(false);

      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const countFollows = async () => {
      try {
        const res = await axios.get('/api/count-follows', {
          withCredentials: true
        })
        console.log(res.data);
        setCounts(res.data);
      } catch (error) {
        console.error('failed fatching counts: ', error);
      }
    }
    countFollows();
    fetchPosts();
    setShowNav(true);
  },[]);

  return (
    <>
      <div className="fb">
        <div className="box">
          <h1 className="title">All Posts</h1>
          { loading ? (
            <div className="text-center">Loading...</div>
          ) 
          : error ? (
            <div>Error: {error.message }</div>
          )
          :
          (
          <ul>
            {allPosts.map((post) => 
            ( 
              <li key={post.id}>
                <div className="each-post bg-gray-800">
                  <Link to={`/post/${post.id}`}>
                  <div className="card-body block post-title px-1 text-white bg-gray-800 mt-0">
                  <h2 className="post-title"> {post.title }</h2>
                  </div>
                  <div className="block px-1 bg-gray-800 mt-0">
                    <img 
                    src={post.image} 
                    alt="post_image"
                    className="mt-2 img object-cover border border-gray-300" 
                    />
                  </div>
                  </Link>
                  <div className="body">
                  <p className="mt-1">{ post.body }</p>

                  </div>
                  <div className="flex">
                  <i className="fa-regular fa-heart"></i>
                  <p className="date">{ post.created_at }</p>

                  </div>
                </div>
                
              </li>
            ))}
          </ul>
          )}
        </div>
      
        <div className="bg-red-500 right">
          <div className="userInfo bg-black">
            <div className="avatar flex items-center">
              <Link to={`/profile/${user.user_id}`}>
            {user.image ? 
            <img src="#" alt="avatar"></img>
            :
            <i className="fa-solid fa-user inline"></i>
            }
            </Link>
            </div>
            <div className="ml-2">
              <h3 className="username inline mt-2">{user.name}</h3>

              { counts ? (
                <div>
                <Link to="/follower" className="mr-4">Follower { counts.followerCount }</Link>
                <Link to="/following">Following { counts.followingCount }</Link>
                </div>
              ):(

                <>Loading counts</>
              )}
                
              </div>
            </div>
        </div>
      </div>
    </>
  );
}

