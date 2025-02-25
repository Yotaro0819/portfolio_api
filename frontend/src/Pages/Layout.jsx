
import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import axiosInstance from '../api/axios';

export default function Layout() {
  const { authUser, setAuthUser } = useContext(AppContext);
  const [ showNav, setShowNav] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setShowNav(true);  // userがnullならナビゲーションを非表示にする
    }
  }, [authUser, setShowNav]);

  async function handleLogout(e) {
    e.preventDefault();

    try {
      const res = await axiosInstance.post('/api/logout');
  
      console.log("Response:", res);  // レスポンスの内容を確認
  
      if (res.status === 200) {
        setAuthUser(null);
        setShowNav(false)
        localStorage.removeItem('authUser');

        navigate('/');
      }
    } catch (error) {
      console.error("Logout error:", error.response || error);  // エラーを確認
      setShowNav(false);
      
    }
  }


  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {showNav && (
        <header>
          <nav>
          <div>
            <h1 className="text-4xl text-white mb-5">ArtCrafts</h1>
          </div>
          <div>

              <> 
                <div>
                <p className="text-white my-2.5 block text-2xl">Welcome Back!</p>
                </div>
                <div>
                <Link to="/" className="nav-link m-5 block"><p className="text-2xl">Home</p></Link>
                </div>
                <Link to="/create" className="nav-link block"><p className="text-2xl">New Post</p></Link>
                <Link to={`/profile/${authUser.user_id}`} className="nav-link m-5 block"><p className="text-2xl">Profile</p></Link>
                <Link to={"/messages/index"} className="nav-link m-5 block"><p className="text-2xl">Messages</p></Link>
                <div>
                <form onSubmit={handleLogout} className="m-0 text-2xl">
                  <button className="m-0 p-0 text-left">Logout</button>
                </form>
                </div>
              </>
              </div>

          </nav>
        </header>
      )}

      {/* メインコンテンツ */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
