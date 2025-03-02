import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context/AppContext';
import ConnectStripe from '../../Component/StripeConnect';
import axiosInstance from '../../api/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = () => {
  const { authUser } = useContext(AppContext);
  const [imagePreview, setImagePreview] = useState(""); // 初期値を空文字に
  const [error, setError] = useState(null); // エラーメッセージの状態を追加
  const [avatar, setAvatar] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [website, setWebsite] = useState(''); 
  const [message, setMessage] = useState('');

  console.log(error);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance('/api/get-avatar');
        console.log(res.data);
        setAvatar(res.data);
      } catch (error) {
        console.error('failed fetching avatar: ', error);
        localStorage.removeItem('authUser');
      }
    }
    fetchUser();
  },[])

  // 画像が選択されたときに実行
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // 画像のプレビューを表示
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      // アップロード処理
      const data = new FormData();
      data.append('avatar', file);
      data.append('_method', 'PATCH');
      
      try {
        const res = await axiosInstance.post('/api/avatar-update', data);
        console.log(res.data);

        setError(null); // 成功したらエラーをクリア
      } catch (error) {
        console.error('failed uploading your avatar: ', error);
        setError('Failed to upload avatar. Please try again.'); // エラーメッセージを表示
      }
    }
  };

  const handlePassword = async () => {
    try {
      const res = await axiosInstance.patch('/api/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      });
      toast.success("You successfully changed the password!", {
        position: "top-right",
        autoClose: 2000,
      }) 
    } catch (error) {
      toast.error("You failed to change the password...", {
        position: "top-right",
        autoClose: 2000,
      })
      console.error('Failed to update password: ', error);
    }
  }

  const handleWebsite = async () => {

    try {
      const res = await axiosInstance.patch('/api/change-website', {
        website: website,
      })
      toast.success(`You successfully changed your website! ${website}`, {
        position: "top-right",
        autoClose: 2000,
      })
      setMessage(res.data.message);
    } catch (error) {
      toast.error("You failed to change your website...", {
        position: "top-right",
        autoClose: 2000,
      })
      const errors = error.response.data.errors;
      setError(errors.website);
      console.error('Failed to update websiteUrl:', error);
    }
  }

  return (
    <div className="fb">
      <div className="w-80">
        <div className="m-5 p-4 bg-gray-800 h-96 border border-white">
          <Link to={'/purchase-history'} className="block text-2xl">Purchase history</Link>
          <Link to={'/sales-history'} className="block text-2xl mt-3">Sales history</Link>
          <Link to={'/ongoing-orders'} className="block text-2xl mt-3">Ongoing orders</Link>
        </div>
      </div>
      <div className="w-1/2 mt-5 border bg-gray-900">
        <div className="flex mx-auto w-3/4">
          <div className="mt-5">
            <label htmlFor="avatarInput" className="cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : avatar ? (
                <img 
                  src={avatar}
                  alt="avatar"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-400 flex items-center justify-center">
                  <i className="fa-solid fa-user text-7xl text-gray-600"></i>
                </div>
              )}
            </label>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <div className="m-5">
            <input 
                  type="text" 
                  className="block post-title px-1 text-white bg-gray-900 mt-0"
                  placeholder={authUser.name}
            />
              <p className="my-4">Tap the icon to change the Avatar</p>
            </div>
          </div>
        </div>

        <div className="mt-20 p-4">
          <label className="w-3/4 mx-auto">Self-Introduction</label>
            <textarea 
            rows="6" 
            className="block px-2 py-1 text-white bg-gray-500 mt-1 mx-auto w-3/4"
            placeholder="Post Content"
            />
        </div>
        <div className="p-4">
          <label className="w-3/4 mx-auto">website URL</label>
          <input 
          type="text"
          className="block px-4 bg-gray-500 mt-1 mx-auto w-3/4" 
          placeholder="Enter your Website URL"
          onChange={(e) => setWebsite(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              e.preventDefault();
              handleWebsite();
            }
          }}
          />
          <div className="w-3/4 mx-auto">{error && <p className="text-red-500">{error}</p>}</div>
          <div className="w-3/4 mx-auto">{message && <p className="text-blue-500">{message}</p>}</div>
        </div>
        <div className="px-4 pt-4">
          <label className="mt-5 w-3/4 mx-auto">Connect with your Stripe Account</label>
          <ConnectStripe />
        </div>
        <div className="mt-3 bg-black px-4 pb-4">
          <p className="pt-2 mx-auto">Change Password</p>
          <form action="">
            <label className="block w-3/4 mx-auto">Current password</label>
            <input 
            type="password" 
            className="block w-1/2 mx-auto bg-gray-500 px-1" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
              />
            <label className="block w-3/4 mx-auto">New password</label>
            <input 
            type="password" 
            className="block w-1/2 mx-auto bg-gray-500 px-1"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className="block w-3/4 mx-auto">Confirm new password</label>
            <input 
            type="password" 
            className="block w-1/2 mx-auto bg-gray-500 px-1"
            value={newPasswordConfirmation}
            onChange={(e) => setNewPasswordConfirmation(e.target.value)} />
            <div className="flex justify-center">
            <button 
            className="w-1/2 bg-yellow-300 rounded-lg mt-4"
            onClick={handlePassword}
            type="button"
            >Confirm</button>
            </div>
          </form>
        </div>


        {error && <div className="text-red-500 mt-2">{error}</div>} {/* エラーメッセージの表示 */}
      </div>
    </div>
  );
};

export default EditProfile;
