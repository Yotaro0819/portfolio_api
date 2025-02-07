import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Following = () => {
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await axios.get('/api/fetch-following', {
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
    <>
    <div>Following</div>
    {following.length > 0 ? (
                <ul>
                    {following.map((following) => (
                        <li key={following.following_id} className="flex items-center space-x-2">
                            {/* アバターの表示 */}
                            {following.following && following.following.avatar ? (
                                <img
                                    src={following.following.avatar}
                                    alt={following.following.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <i className="fa-solid fa-circle-user text-secondary text-2xl"></i>
                            )}
                            {/* ユーザー名の表示 */}
                            <span>{following.following?.name || "Unknown User"}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>フォローしているユーザーがいません</p>
            )}
    </>
  )
}

export default Following