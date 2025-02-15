
import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Layout.css';
import { AppContext } from '../Context/AppContext';

export default function Layout() {
  const { user, setUser } = useContext(AppContext);
  const [ showNav, setShowNav] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setShowNav(true);  // userがnullならナビゲーションを非表示にする
    }
  }, [user, setShowNav]);

  async function handleLogout(e) {
    e.preventDefault();

    try {
      const res = await axios.post('/api/logout', {}, {
        withCredentials: true,
      });
  
      console.log("Response:", res);  // レスポンスの内容を確認
  
      if (res.status === 200) {
        setUser(null);
        setShowNav(false)
        localStorage.removeItem('user');

        navigate('/');
      }
    } catch (error) {
      console.error("Logout error:", error.response || error);  // エラーを確認
      
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
                <div>
                <form onSubmit={handleLogout} className="m-0 text-2xl">
                  <button>Logout</button>
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
