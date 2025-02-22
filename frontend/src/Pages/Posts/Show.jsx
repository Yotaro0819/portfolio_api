import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import '../../styles/Show.css';
import RightSideBuy from '../../Component/RightSideBuy';
import { AppContext } from '../../Context/AppContext';
import axiosInstance from '../../api/axios';
import LikeButton from '../../Component/LikeButton';

const Show = () => {
  const { authUser } = useContext(AppContext);
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  // console.log(post_id)
  // console.log(post)
  console.log(comment);

  const openModal = () => setIsModalOpen(true);

  // モーダルを閉じる
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance(`/api/posts/${post_id}`)
        console.log(res.data);
        setPost(res.data);
      } catch (error) {
        console.error('failed fetching post: ', error);
      }
    }

    fetchPost();
  },[])

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axiosInstance.post('/api/comment/store', {
        post_id: post.id,
        comment: comment,
      });
      console.log(res.data);
      // setMessage('Your comment is sended');
      closeModal();
    } catch (error) {
      setMessage('Canceled to send your message');
      console.error('failed post your comment: ', error);
      localStorage.removeItem('authUser');
    }
  }
 
  return (
    <>
      <div>
        {post ? (
          <>
              {message && (
                  <div className="overlay">
                    <div className="message">
                      {message}
                    </div>
                  </div>
              )}
          <div className="fb">
            <div className="box">
              <div className="content">
                <h2 className="title">Details of the post</h2>
                  <div className="post-showing bg-gray-800">
                    <p className="post-title post-show">{post.title}</p>
                      <div className="block px-1 bg-gray-800 mt-0">
                      <img 
                      src={post.image} 
                      alt="post_image"
                      className="post-image mt-2 img object-cover border border-gray-300" 
                      />
                      </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="mt-2">
                      <LikeButton postId={ post.id } isLiked={ post.isLiked } likeCount={ post.like_count } />
                    </div>
                    <button
                      className="comment-btn bg-blue-500 text-white p-2"
                      onClick={openModal}
                    >
                      Add Comment
                    </button>
                  </div>
              </div>
            </div>

            {isModalOpen && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3 className="modal-title">Leave a Comment</h3>
                  <form onSubmit={handleSubmit}>
                    <textarea
                      className="bg-gray-600 text-white p-3 w-full comment-form h-60"
                      placeholder="Type your comment here..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)} // コメントの内容を更新
                    />
                    <div className="button-group">
                      <button type="submit" className="bg-green-500 text-white px-2 mt-4 rounded">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            

            <RightSideBuy className="show-body" post={post} authUser={authUser} setMessage={setMessage} />
           
        </div>
                    
          </>
        ) : (
          <>loading post info...</>
        )}
      </div>
    </>

  )
}

export default Show