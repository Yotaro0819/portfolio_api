import React, { useState } from 'react';
import '../../styles/Create.css';
import PriceInput from '../../Component/PriceInput.jsx';
import axiosInstance from '../../api/axios.js';
const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    price: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null); // 画像プレビュー用

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
  console.log('Post created successfully:', res.data);

  setFormData({ title: "", body: "", price: "", image: null });
  setImagePreview(null);
} catch (error) {
  console.error('Error creating post:', error.response ? error.response.data : error.message);
}

  }

  return (
    <>
    <div className="fb">
      <div className="box">
        <div className="content">
        <h1 className="title">Create a new post</h1>

        <div className="post bg-gray-800">
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

            <div>
              <textarea 
                rows="6" 
                className="block px-1 text-white bg-gray-500"
                placeholder="Post Content"
                value={formData.body}
                onChange={(e) => {
                  setFormData({ ...formData, body: e.target.value })
                }} />
            </div>

            <PriceInput
              value={formData.price}
              onChange={(value) => {
                setFormData({ ...formData, price: value });
              }}
            />

            <button className="bg-cyan rounded">Create</button>
          </form>
        </div>
        </div>
      </div>
      <div className="bg-red-500 create-right">hello this is right sec</div>
      </div>
    </>
  );
};

export default Create;
