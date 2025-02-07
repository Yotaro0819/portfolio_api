import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Follower = () => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get('/api/fetch-followers', {
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
    <>
    <div>Follower</div>
    {followers.length > 0 ? (
                <ul>
                    {followers.map((follower) => (
                        <li key={follower.follower_id} className="flex items-center space-x-2">
                            {/* アバターの表示 */}
                            {follower.follower && follower.follower.avatar ? (
                                <img
                                    src={follower.follower.avatar}
                                    alt={follower.follower.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <i className="fa-solid fa-circle-user text-secondary text-2xl"></i>
                            )}
                            {/* ユーザー名の表示 */}
                            <span>{follower.follower?.name || "Unknown User"}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>フォロワーがいません</p>
            )}
    </>
  )
}

export default Follower