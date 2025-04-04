import React, { useContext, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useContext(AppContext);
  const [auth, setAuth] = useState("");


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});


  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post('/api/login',formData, {
	withCredentials: true,
        headers: {
          "Content-type": "application/json",
        }
      });

      console.log("headers:", res.headers);
      console.log("27: ",res.data);
      setAuthUser(res.data.authUser);
      localStorage.setItem('authUser', JSON.Stringify(res.data.authUser));
      navigate('/');
    }catch(error) {
      if(error.response) {
        setErrors(error.response.data.errors);
      } else {
        setErrors('failed to connect to server');
      }
    }

  }
  


  return (
    <>
      <h1 className="title">Login to your account</h1>
      <form onSubmit={handleLogin} className="login-form w-1/2 mx-auto space-y-6">
        <div>
          <input
            className="border rounded w-full px-2 bg-gray-800"
            type="text"
            placeholder="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
            // autoComplete="new-password"
          />
          {errors.email ? <p className="text-red-500">{errors.email[0]}</p> : <p>&nbsp;</p>}
        </div>
        <div>
          <input
            className="border rounded w-full px-2 bg-gray-800"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
            // autoComplete="new-password"
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
