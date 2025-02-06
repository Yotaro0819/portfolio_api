import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import '../src/styles/App.css';
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Profile from "./Pages/User/Profile";
import Follower from "./Pages/User/Follower";
import Following from "./Pages/User/Following";
import PostShow from "./Pages/Posts/Show";
import Success from "./Pages/Payments/Success";
import Cancel from "./Pages/Payments/Cancel";
import { AppContext } from "./Context/AppContext";
import Create from "./Pages/Posts/Create";

function App() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate(); // useNavigateフックを使ってリダイレクト

  // userがnullの場合にログインページへリダイレクト
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={!user ? <Login /> : <Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={user ? <Create /> : <Login />} />
        <Route path="/profile/:id" element={user ? <Profile /> : <Login />} />
        <Route path="/follower" element={user ? <Follower /> : <Login />} />
        <Route path="/following" element={user ? <Following /> : <Login />} />
        <Route path="/post/:post_id" element={user ? <PostShow /> : <Login />} />
      </Route>
      <Route path="/paypal/success" element={user ? <Success /> : <Login />} />
      <Route path="/paypal/cancel" element={user ? <Cancel /> : <Login />} />
    </Routes>
  );
}

// <BrowserRouter>でApp全体をラップ
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
