import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context/AppContext';
import axiosInstance from '../../api/axios';

const EditProfile = () => {
  const { authUser } = useContext(AppContext);
  const [imagePreview, setImagePreview] = useState(""); // 初期値を空文字に
  const [error, setError] = useState(null); // エラーメッセージの状態を追加
  const [avatar, setAvatar] = useState(null);

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

  return (
    <div className="container w-1/2 ml-64 mt-2 border bg-gray-900">
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
      <div className="mt-5 p-4">
        <label className="w-3/4 mx-auto">website URL</label>
        <input type="text"className="block px-4 bg-gray-500 mt-1 mx-auto w-3/4" placeholder="Enter your Website URL"/>
      </div>
      <div className="mt-5 p-4">
        <label className="mt-5 w-3/4 mx-auto">Connect with your Stripe Account</label>
        <button className="block bg-blue-400 px-2 py-2 rounded-md text-sm mt-2 mx-auto w-1/2">Connect</button>
      </div>
      <div className="mt-5 bg-black p-4">
        <p className="mt-5 mx-auto">Change Password</p>
        <label className="block w-3/4 mx-auto">Current password</label>
        <input type="password" className="block w-1/2 mx-auto"/>
        <label className="block w-3/4 mx-auto">New password</label>
        <input type="password" className="block w-1/2 mx-auto"/>
      </div>


      {error && <div className="text-red-500 mt-2">{error}</div>} {/* エラーメッセージの表示 */}
    </div>
  );
};

export default EditProfile;
