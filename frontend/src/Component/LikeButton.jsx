import React, { useState } from 'react'
import axiosInstance from '../api/axios';

const LikeButton = ({postId, isLiked, likeCount, addClass}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCounts, setLikeCounts] = useState(likeCount);

  const handleLike = async () => {
    try {
      if (liked) {
        const res = await axiosInstance.delete(`/api/like/${postId}`)
        setLiked(false)
        setLikeCounts(likeCounts - 1)
      } else {
        const res = await axiosInstance.post(`/api/like/${postId}`)
        setLiked(true)
        setLikeCounts(likeCounts + 1)
      }
    } catch (error) {
      console.error('failed unlike or like post: ', error)
    }
  }

  return (
    <button onClick={handleLike} className={`p-0 m-0 w-auto ml-4 ${addClass}`}>
      {liked ? (
        <i className="fa-solid fa-heart"></i>
      ) : (
        <i className="fa-regular fa-heart"></i>
      )} 
    </button>
  )
}

export default LikeButton