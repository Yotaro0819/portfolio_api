import React, { useState } from 'react'
import axios from 'axios';
import '../../styles/Create.css';
const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    price: "",
  })
  const [image, setImage] = useState(null)

  const handleFileChange = (event) =>{
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImage(objectUrl);
    } else {
      setImage(null); // 画像が選択されていなければプレビューを消す
    }
  }

  async function handleCreate(e) {
    e.preventDefault();

    const data = new FormData();

    data.append('title',formData.title);
    data.append('body',formData.body);
    data.append('price',formData.price);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const res = await fetch('http://localhost:8000/api/posts', {
        method: 'POST',
        headers: {
          // Content-Type は fetch が自動で設定するので不要
        },
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
        onChange={handleFileChange}/>
      </div>
      <div className="m-5">
      {image ? (
        <img
          src={image}
          alt="Preview"
          className="mt-2 prev-img object-cover border border-gray-300"
        />
      )
    :
    (
      <div class="prev-non">
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
        }}
          ></textarea>
      </div>

      <div className="prices">
        <p className="p-2 btn inline">¥
        <input 
        type="number"
        className="btn text-white bg-gray-800 input-price" 
        placeholder="price"
        value={formData.price}
        onChange={(e) => {
          setFormData({ ...formData, price: e.target.value})
        }}/>

        </p>

      </div>
      

      <button className="bg-cyan rounded">Create</button>
    </form>
    </div>
    </div>
    </>
  )
}

export default Create