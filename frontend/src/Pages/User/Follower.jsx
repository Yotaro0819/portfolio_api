import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import PostList from '../../Component/PostList';
import FollowButton from '../../Component/FollowButton';
import axiosInstance from '../../api/axios';

const Follower = () => {
  const [followers, setFollowers] = useState([]);
  const {user_id} = useParams();
  console.log(followers);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axiosInstance.get(`/api/fetch-followers/${user_id}`)
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
        {followers.map((follower) => {
            return (
              <div key={follower.id} >
                <div className="flex items-center gap-x-4">
                    <Link to={`/profile/${follower.id}`} className="flex items-center space-x-2">
                            { follower?.avatar ? (
                                <img
                                    src={follower.avatar}
                                    alt={follower.avatar}
                                    className="w-12 h-12 rounded-full my-2 object-cover"
                                />
                            ) : (
                                <i className="fa-solid fa-circle-user text-secondary text-5xl w-12 h-12 my-2"></i>
                            )}
                            <span className="text-2xl">{follower.name || "Unknown User"}</span>
                    </Link>
                    <FollowButton userId={follower.id} isFollowing={follower.isFollowing} />
                </div>
                <div>
                  <PostList id={follower.id} imageSize="w-24 h-24 mx-auto" grid="grid-cols-6"/>
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

export default Follower