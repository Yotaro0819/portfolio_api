import React, { useContext, useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});


  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.errors || !res.ok) {
      setErrors(data.errors);
    }else {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/');
    }

  }
  


  return (
    <>
      <h1 className="title">Login to your account</h1>
      <form onSubmit={handleLogin} className="w-1/2 mx-auto space-y-6">
        <div>
          <input
            className="border rounded w-full px-2"
            type="text"
            placeholder="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />
          {errors.email ? (
            <p className="text-red-500">{errors.email[0]}</p>
          ) : (
            <p>&nbsp;</p>
          )}
        </div>
        <div>
          <input
            className="border rounded w-full px-2"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          {errors.password ? (
            <p className="text-red-500">{errors.password[0]}</p>
          ) : (
            <p>&nbsp;</p>
          )}
        </div>

        <div className="flex items-center space-x-4">

        <button className="bg-blue-500 text-white py-2 px-4 rounded transition transform hover:bg-blue-600 hover:scale-90">
          Login
        </button>
        <div>
        <p>Don't have an account yet? <Link to="/Register" className="text-blue-500">Register</Link> now.</p>
      </div>
      </div>

      </form>
     

    </>
  );
};

export default Login;
