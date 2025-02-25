import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import FollowButton from './FollowButton';
import StripeButton from './StripeButton';

const RightSideBuy = ( {post, authUser} ) => {
  const [user, setUser] = useState(null);
  console.log(post)
  console.log(user?.stripe_account_id)

  useEffect(() => {
    if (post?.user_id) {
      const fetchUser = async () => {
        try {
          const res = await axiosInstance(`/api/user-info/${post.user_id}`);
          console.log("Fetched user data:", res.data);
          setUser(res.data);
        } catch (error) {
          console.error('Failed fetching user data: ', error);
          localStorage.removeItem('authUser');

        }
      };
      fetchUser();
    }
  }, [post]);  // postが変わるたびに実行
  

  return (
    <div className="right bg-gray-800">
      <p className="text-2xl mt-10 mb-4 text-center">Post Owner Info</p>
      <div className="flex justify-center">
        <div className="avatar flex items-center">
          <Link to={`/profile/${post.user_id}`}>
            {user?.avatar ? 
            <img 
            src={user?.avatar} 
            alt={user?.avatar}
            className="w-24 h-24 rounded-full object-cover"
            />
              :
            <i className="fa-solid fa-user inline"></i>
            }
            </Link>
        </div>
        <div>
          <p className="text-4xl">{user?.name}</p>
          <div className="flex my-4 align-center">
            <Link to={`/follower/${user?.id}`} className="mt-1">follower {user?.followers_count}</Link>
            <Link to={`/following/${user?.id}`} className="mx-4 mt-1">following {user?.following_count}</Link>
            <FollowButton userId={user?.id} isFollowing={user?.isFollowing}></FollowButton>
          </div>
        </div>
      </div>
            
            <div>
              <p className="show-body">{ post.body }</p>
              <p className="price">{ post.price }</p>
            </div>

              { post.user_id !== authUser.user_id ? (
                <div className="mx-auto w-40 flex mt-4 justify-center">
                  {user?.stripe_account_id ? (
                  <StripeButton sellerId={post.user.id} title={post.title} price={post.price} ></StripeButton>
                  ) : (
                  <div>No selling</div>
                  )}
              </div>
            ) : (
              <div className="mx-auto w-40 flex mt-4 justify-center">
                <p>Your post</p>
              </div>
            )}
            
          </div>
  )
}

export default RightSideBuy