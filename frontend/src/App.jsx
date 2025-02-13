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
import Payment from "./Pages/Payments/Payment";
import EditProfile from "./Pages/User/EditProfile";

function App() {
  const { authUser } = useContext(AppContext);
  const navigate = useNavigate(); // useNavigateフックを使ってリダイレクト

  // userがnullの場合にログインページへリダイレクト
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [user, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={!authUser ? <Login /> : <Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={authUser ? <Create /> : <Login />} />
        <Route path="/profile/:user_id" element={authUser ? <Profile /> : <Login />} />
        <Route path="/edit-profile" element={authUser ? <EditProfile /> : <Login />} />
        <Route path="/follower/:user_id" element={authUser ? <Follower /> : <Login />} />
        <Route path="/following/:user_id" element={authUser ? <Following /> : <Login />} />
        <Route path="/post/:post_id" element={authUser ? <PostShow /> : <Login />} />
      </Route>
      <Route path="/paypal/success" element={authUser ? <Success /> : <Login />} />
      <Route path="/paypal/cancel" element={authUser ? <Cancel /> : <Login />} />
      <Route path="post/:id/payment" element={authUser ? <Payment /> : <Login />} />
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
