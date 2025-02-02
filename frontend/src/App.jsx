import{ BrowserRouter, Routes, Route} from "react-router-dom";
import '../src/styles/App.css';
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import { useContext } from "react";
import { AppContext } from "./Context/AppContext";
import Create from "./Pages/Posts/Create";

function App() {
  const {user} = useContext(AppContext);

  
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={!user ? <Login /> : <Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={user ? <Create /> : <Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App
