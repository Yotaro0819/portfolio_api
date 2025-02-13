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
    <div className="container w-1/2 mx-auto mt-20">
      <div className="flex">
        <div>
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
            <p className="text-4xl">{authUser.name}</p>
            <p className="my-4">Tap the icon to change the Avatar</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
            Self-Introduction
      </div>


      {error && <div className="text-red-500 mt-2">{error}</div>} {/* エラーメッセージの表示 */}
    </div>
  );
};

export default EditProfile;
