import React, { useContext, useState } from 'react';

import PriceInput from '../../Component/PriceInput.jsx';
import axiosInstance from '../../api/axios.js';
import RightSideProfile from '../../Component/RightSideProfile.jsx';
import { AppContext } from '../../Context/AppContext.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
    const { authUser } = useContext(AppContext);
    const selectedPost = null;

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    price: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // console.log(errors?.messages?.body[0]);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl); // プレビュー用のURLを設定
      setFormData({ ...formData, image: file }); // 実際のファイルをformDataに保存
    } else {
      setImagePreview(null);
      setFormData({ ...formData, image: null });
    }
  };

  async function handleCreate(e) {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('body', formData.body);
    data.append('price', formData.price);
    if (formData.image) {
      data.append('image', formData.image); // 画像ファイルをフォームデータに追加
    }

    // FormDataの内容を確認する
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      // axios使う時はエラーハンドリングも注意。そのままfetchの時みたいにjson使っちゃダメね。
      const res = await axiosInstance.post('/api/posts', data, {
        withCredentials: true,
      });
      toast.success("You posted new post!", {
        position: "top-right",
        autoClose: 1500,
      })

      setFormData({ title: "", body: "", price: "", image: null });
      setImagePreview(null);
    } catch (error) {
      toast.error("You failed to post new post...", {
        position: "top-right",
        autoClose: 1500,
      })
      setErrors(error.response.data);
      localStorage.removeItem('authUser');
    }

  }

  return (
    <>
    <div className="fb">
      <div className="box">
        <div className="content">
        <h1 className="title">Create a new post</h1>

        <div className="post w-4/5 bg-gray-800 ml-150 mb-100">
          <form onSubmit={handleCreate} className="form">
            <div>
              <input 
                type="text" 
                className="block post-title px-1 text-white bg-gray-800 mt-0"
                placeholder="Post Title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                }} />
                {errors && <p className="text-red-500">{errors?.messages?.title[0]}</p>}
            </div>

            
            <div className="card-body my-5">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 prev-img object-cover border border-gray-300"
                />
              ) : (
                <div className="prev-non">
                  <h3>Image</h3>
                </div>
              )}
            </div>

            <div>
              <input 
                type="file"
                className="block px-1 bg-gray-800 mt-0"
                onChange={handleFileChange} />
            </div>
            {errors && <p className="text-red-500">{errors?.messages?.image[0]}</p>}

            <div>
              <textarea 
                rows="6" 
                className="block px-1 text-white bg-gray-500"
                placeholder="Post Content"
                value={formData.body}
                onChange={(e) => {
                  setFormData({ ...formData, body: e.target.value })
                }} />
                {errors && <p className="text-red-500">{errors?.messages?.body[0]}</p>}
            </div>

            <PriceInput
              value={formData.price}
              onChange={(value) => {
                setFormData({ ...formData, price: value });
              }}
            />
            {errors && <p className="text-red-500">{errors?.messages?.price[0]}</p>}

            <button className="bg-cyan rounded">Create</button>
          </form>
        </div>
        </div>
      </div>
      <div><p className="w-20">&nbsp;</p></div>
      {/* <div className="bg-red-500 create-right">hello this is right sec</div> */}
      <RightSideProfile authUser={authUser} selectedPost={selectedPost} />
      </div>
      
    </>
  );
};

export default Create;
