import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import PostList from '../../Component/PostList';
import FollowButton from '../../Component/FollowButton';

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
        {following.map((following) => {
            return (
              <div key={following.id}>
                <div className="flex items-center gap-x-4">
                    <Link to={`/profile/${following.id}`} className="flex items-center space-x-2">
                            { following?.avatar ? (
                                <img
                                    src={following.avatar}
                                    alt={following.avatar}
                                    className="w-12 h-12 rounded-full my-2 object-cover"
                                />
                            ) : (
                                <i className="fa-solid fa-circle-user text-secondary text-5xl w-12 h-12 my-2"></i>
                            )}
                            <span className="text-2xl">{following.name || "Unknown User"}</span>
                    </Link>
                    <FollowButton userId={following.id} isFollowing={following.isFollowing} />
                </div>
                <div>
                  <PostList id={following.id} imageSize="w-24 h-24 mx-auto" grid="grid-cols-6"/>
                </div>
              </div>
            );
        })}
    </ul>
) : (
    <div>
        <h2 className="flex items-center justify-center nothing">No followers yet.</h2>
    </div>
)}
    </div>
  )
}

export default Following