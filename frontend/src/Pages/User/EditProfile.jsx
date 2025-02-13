import React, { useContext, useState } from 'react';
import { AppContext } from '../../Context/AppContext';
import axiosInstance from '../../api/axios';
import { Route } from 'react-router-dom';

const EditProfile = () => {
  const { authUser } = useContext(AppContext);
  const [imagePreview, setImagePreview] = useState();

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
      //laravelはpatchをそのままで認識できないので_methodをpatch指定して、偽造する
      // Routeとaxiosはpostにする
      for (let pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      
      try {
        const res = await axiosInstance.post('/api/avatar-update', data);
        console.log(res.data);
      } catch (error) {
        console.error('failed uploading your avatar: ', error);
      }
    }
  };

  return (
    <div className="container w-3/4 mx-auto">
      <div>
        <label htmlFor="avatarInput" className="cursor-pointer">
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover"
              />
            </>
          ) : (
            <>
              <div className="w-32 h-32 rounded-full bg-gray-400 flex items-center justify-center">
                <i className="fa-solid fa-user text-7xl text-gray-600"></i>
              </div>
            </>
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
    </div>
  );
};

export default EditProfile;
