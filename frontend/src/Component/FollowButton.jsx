import React, { useState } from 'react'

import axiosInstance from '../api/axios'

const FollowButton = ({userId, isFollowing}) => {
  const [following, setFollowing] = useState(isFollowing)

  const handleToggleFollow = async () => {
    try {
      if(following) {
        await axiosInstance.post(`/api/unfollow/${userId}`);
      } else {
        await axiosInstance.post(`/api/follow/${userId}`)
      }
     setFollowing(!following)
    }catch (error) {
      console.error('failed toggling this user: ', error);
    }
  }
  return (
    <button
      onClick={handleToggleFollow}
      className={`px-4 py-1 text-white rounded ${following ? "bg-gray-400" : "bg-blue-500"}`}
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  )
}

export default FollowButton