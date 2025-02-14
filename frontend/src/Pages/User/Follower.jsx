import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import PostList from '../../Component/PostList';

const Follower = () => {
  const [followers, setFollowers] = useState([]);
  const {user_id} = useParams();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`/api/fetch-followers/${user_id}`, {
          withCredentials: true,
        })
        console.log(res.data);
        setFollowers(res.data);
      } catch (error) {
        console.error('failed fatching followers: ', error);
      }
    }
    fetchFollowers();
  },[]) 
  return (
    <div className="w-1/2 mx-auto mt-20">
    <h2 className="text-4xl text-center">Follower</h2>
    {followers.length > 0 ? (
                <ul>
                    {followers.map((follower) => (
                      <div key={`${follower.follower_id}-${follower.following_id}`} >
                        <Link to={`/profile/${follower.follower?.id}`}>
                        <li className="flex items-center space-x-2">
                            {/* アバターの表示 */}
                            {follower.follower && follower.follower.avatar ? (
                                <img
                                    src={follower.follower.avatar}
                                    alt={follower.follower.avatar}
                                    className="w-12 h-12 rounded-full my-2"
                                />
                            ) : (
                                <i className="fa-solid fa-circle-user text-secondary text-5xl w-12 h-12 my-2"></i>
                            )}
                            {/* ユーザー名の表示 */}
                            <span className="text-2xl">{follower.follower?.name || "Unknown User"}</span>
                        </li>
                        </Link>

                          <div>
                              <PostList id={follower.follower_id} imageSize="w-24 h-24 mx-auto" grid="grid-cols-6"/>
                          </div>
                        </div>
                    ))}
                </ul>
            ) : (
                <div>
                  <h2 className="flex items-center justify-center nothing">No followers yet.</h2>
                </div>
            )}
    </div>
  )
}

export default Follower