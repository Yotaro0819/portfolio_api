import React, { useState } from 'react'
import axios from 'axios';
const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  })

  async function handleCreate(e) {
    e.preventDefault();

    const data = new FormData();

    data.append('title',formData.title);
    data.append('body',formData.body);
    try {
      const res = await axios.post('/api/posts', data, {
        withCredentials: true, // credentialsオプションではなくwithCredentials
      });
      
      console.log(res.data); // レスポンスデータをログに出力（確認用）
    } catch (error) {
      console.error('Error creating post:', error); // エラーハンドリング
    }
  }
  return (
    <>
    <h1 className="title">Create a new post</h1>

    <form onSubmit={handleCreate} className="w-1/2 mx-auto space-y-6">
      <div>
        <input 
        type="text" 
        placeholder="Post Title"
        value={formData.title}
        onChange={(e) => {
          setFormData({ ...formData, title: e.target.value })
        }} />
      </div>
      <div>
        <textarea 
        rows="6" 
        placeholder="Post Content"
        value={formData.body}
        onChange={(e) => {
          setFormData({ ...formData, body: e.target.value })
        }}
          ></textarea>
      </div>

      <button className="bg-cyan rounded">Create</button>
    </form>
    </>
  )
}

export default Create