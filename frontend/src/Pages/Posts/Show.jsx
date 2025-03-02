import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import '../../styles/Show.css';
import RightSideBuy from '../../Component/RightSideBuy';
import { AppContext } from '../../Context/AppContext';
import axiosInstance from '../../api/axios';
import LikeButton from '../../Component/LikeButton';
import dayjs from 'dayjs';

const Show = () => {
  const { authUser } = useContext(AppContext);
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);

  // console.log(post_id)
  // console.log(post)
  console.log(comment);

  const openModal = () => setIsModalOpen(true);
  const openModal2 = (comment) => {
    setIsModalOpen2(true);
    setSelectedComment(comment)
  }

  // モーダルを閉じる
  const closeModal = () => setIsModalOpen(false);
  const closeModal2 = () => {
    setIsModalOpen2(false);
    setSelectedComment(null);
  }

  const fetchComment = async () => {
    try {
      const res = await axiosInstance(`/api/comments/${post_id}`)
      console.log(res.data);
      setAllComments(res.data);
    } catch (error) {
      console.error('Failed fetching comment: ', error);
    }
  }

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
    fetchComment();
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

    fetchComment();
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
                    <div className="h-32 overflow-auto">
                      {allComments.map((comment) => {
                        return (
                          <div key={comment.id} className="bg-gray-400 border p-2">
                            <button onClick={()=> {openModal2(comment)}} className="w-full text-left p-3">
                              <div className="flex items-center">
                                <div>
                                  {comment.user.avatar ? (
                                    <img 
                                    src={comment.user.avatar}
                                    alt={comment.user.avatar}
                                    className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <i className="fa-solid fa-user inline"></i>
                                  )}
                                </div>
                                <p className="font-bold ml-3">{comment.user.name}</p>
                              </div>
                              
                              <p className="break-words">{comment.body}</p>
                              <p className="text-right">{dayjs(comment.created_at).format("YYYY/MM/DD HH:mm")}</p>
                            </button>
                          </div>
                        )
                      })}
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

            {isModalOpen2 && (
              <div className="modal-overlay" onClick={closeModal2}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <Link to={`/profile/${selectedComment.user_id}`}>
                    <div className="flex items-center m-2">
                      {selectedComment.user.avatar ? (
                        <img src={selectedComment.user.avatar} alt={selectedComment.user.avatar}
                        className="w-16 h-16 rounded-full object-cover"
                        />
                      ):(
                        <i className="fa-solid fa-user inline"></i>
                      )}
                      <h2 className="text-2xl ml-3">{selectedComment.user.name}</h2>
                    </div>
                  </Link>
                  <p className="h-20 bg-gray-400 p-1 break-words">{selectedComment.body}</p>
                  <p className="text-right">{dayjs(selectedComment.created_at).format("YYYY/MM/DD HH:mm")}</p>
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