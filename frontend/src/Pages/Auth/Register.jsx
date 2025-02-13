import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';

const Register = () => {
  const navigate = useNavigate();
  const {setShowNav} = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setShowNav(false);

    return () => {
      // クリーンアップ時に元に戻す
      setShowNav(true);
    };
  }, [setShowNav]);

  // console.log(formData);

  async function handleRegister(e) {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'post',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });


    const data = await res.json();

    if(data.errors || !res.ok) {
      setErrors(data.errors);
      // console.log(data.errors);
    } else {
    navigate("/");
    }
    console.log(errors);

  }

  return (
    <>  
    <h1 className="title">Register a new account</h1>

    
    <form onSubmit={handleRegister} className="register-form w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Name" 
        className="border rounded w-full px-2  bg-gray-800"
        value={formData.name}
        onChange={(e) => { setFormData({...formData, name: e.target.value})}}/>
        {/* {errors.name && <p className="text-red-500">{errors.name[0]}</p>} */}
        {errors.name ? <p className="text-red-500">{errors.name[0]}</p> : <p>&nbsp;</p>}
      </div>

      <div>
        <input type="text" 
        className="border rounded w-full px-2  bg-gray-800"
        placeholder="email"
        value={formData.email}
        onChange={(e) => { setFormData({...formData, email: e.target.value})}} />
         {errors.email ? <p className="text-red-500">{errors.email[0]}</p> : <p>&nbsp;</p>}
      </div>

      <div>
        <input type="password" 
        className="border rounded w-full px-2 bg-gray-800"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => { setFormData({...formData, password: e.target.value})}}  />
         {errors.password ? <p className="text-red-500">{errors.password[0]}</p> : <p>&nbsp;</p>}

      </div>

      <div>
        <input type="password" 
        className="border rounded w-full px-2 bg-gray-800"
        placeholder="Confirm Password"
        value={formData.password_confirmation}
        onChange={(e) => { setFormData({...formData, password_confirmation: e.target.value})}} 
        />
      </div>

      <button className="bg-blue-500 text-white py-2 px-4 rounded transition transform hover:bg-blue-600 hover:scale-90">Register</button>
    </form>
    </>
  )
}

export default Register