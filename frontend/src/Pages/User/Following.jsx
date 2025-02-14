import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import PostList from '../../Component/PostList';

const Following = () => {
  const [following, setFollowing] = useState([]);
  const {user_id} = useParams();
  console.log(following);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await axios.get(`/api/fetch-following/${user_id}`, {
          withCredentials: true,
        })
        console.log(res.data);
        setFollowing(res.data);
      } catch (error) {
        console.error('failed fatching followings: ', error);
      }
    }
    fetchFollowings();
  },[]) 
  return (  
    <div className="w-1/2 mx-auto mt-20">
    <h2 className="text-4xl">Followings</h2>
    {following.length > 0 ? (
                <ul>
                    {following.map((following) => (
                      <div key={following.following_id}>
                        <Link to={`/profile/${following.following?.id}`}>
                        <li className="flex items-center space-x-2">
                            {/* アバターの表示 */}
                            {following.following && following.following.avatar ? (
                                <img
                                    src={following.following.avatar}
                                    alt={following.following.name}
                                    className="w-12 h-12 rounded-full my-2"
                                />
                            ) : (
                                <i className="fa-solid fa-circle-user text-secondary text-5xl w-12 h-12 my-2"></i>
                            )}
                            {/* ユーザー名の表示 */}
                            <span className="text-2xl">{following.following?.name || "Unknown User"}</span>
                        </li>
                        </Link>
                          <div>
                              <PostList id={following.following_id} imageSize="w-24 h-24 mx-auto" grid="grid-cols-6"/>
                          </div>
                      </div>
                    ))}
                </ul>
            ) : (
                <div>
                <p className="flex items-center justify-center nothing">No following yet.</p>
                </div>
            )}
    </div>
  )
}

export default Following