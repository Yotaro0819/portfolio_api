import React, { useState } from 'react';
import '../../styles/Create.css';

const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    price: "",
    image: ""
  });
  const [imagePreview, setImagePreview] = useState(null); // 画像プレビュー用

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // if (file) {
    //   const objectUrl = URL.createObjectURL(file);
    //   setImagePreview(objectUrl); // プレビュー用のURLを設定
      setFormData({ ...formData, image: file }); // 実際のファイルをformDataに保存
    // } else {
    //   setImagePreview(null);
    //   setFormData({ ...formData, image: null });
    // }
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
      const res = await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        body: data, // FormData をそのまま送る
        credentials: 'include', // クッキー送信
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      const responseData = await res.json();
      console.log('Success:', responseData);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  return (
    <>
      <div className="container">
        <h1 className="title">Create a new post</h1>

        <div className="card bg-gray-600">
          <form onSubmit={handleCreate}>
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

            <div>
              <input 
                type="file"
                className="block px-1 bg-gray-800 mt-0"
                onChange={handleFileChange} />
            </div>
            
            <div className="m-5">
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
              <textarea 
                rows="6" 
                className="block px-1 text-white bg-gray-500"
                placeholder="Post Content"
                value={formData.body}
                onChange={(e) => {
                  setFormData({ ...formData, body: e.target.value })
                }} />
            </div>

            <div className="prices">
              <p className="p-2 btn inline">¥
                <input 
                  type="number"
                  className="btn text-white bg-gray-800 input-price" 
                  placeholder="price"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: e.target.value })
                  }} />
              </p>
            </div>

            <button className="bg-cyan rounded">Create</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Create;
