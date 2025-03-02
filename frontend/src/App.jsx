import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import EditProfile from "./Pages/User/EditProfile";
import MessageIndex from "./Pages/Messages/Index";
import MessageShow from "./Pages/Messages/Show";
import PurchaseHistory from "./Pages/User/PurchaseHistory";
import SalesHistory from "./Pages/User/SalesHistory";
import OngoingOrders from "./Pages/User/OngoingOrders";

function App() {
  const { authUser } = useContext(AppContext);

  useEffect(() => {
    const handlePopState = (event) => {
        console.log("popstate event:", event);
        console.log("current pathname:", window.location.pathname);

        if (window.location.pathname === "/login") {
            localStorage.removeItem("authUser");
            window.location.reload(); // リロードでサイドバーの状態をリセット
        }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
        window.removeEventListener("popstate", handlePopState);
    };
}, []);



  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={authUser ? <Home /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={authUser ? <Create /> : <Login />} />
        <Route path="/profile/:user_id" element={authUser ? <Profile /> : <Login />} />
        <Route path="/edit-profile" element={authUser ? <EditProfile /> : <Login />} />
        <Route path="/follower/:user_id" element={authUser ? <Follower /> : <Login />} />
        <Route path="/following/:user_id" element={authUser ? <Following /> : <Login />} />
        <Route path="/post/:post_id" element={authUser ? <PostShow /> : <Login />} />
        <Route path="/messages/index" element={authUser ? <MessageIndex /> : <Login />} />
        <Route path="/messages/show/:user_id" element={authUser ? <MessageShow /> : <Login />} />
        <Route path="/purchase-history" element={authUser ? <PurchaseHistory /> : <Login />} />
        <Route path="/sales-history" element={authUser ? <SalesHistory /> : <Login />} />
        <Route path="/ongoing-orders" element={authUser ? <OngoingOrders /> : <Login />} />
      </Route>
      <Route path="/payment/success" element={authUser ? <Success /> : <Login />} />
      <Route path="/payment/failure" element={authUser ? <Cancel /> : <Login />} />
    </Routes>
    </>
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
