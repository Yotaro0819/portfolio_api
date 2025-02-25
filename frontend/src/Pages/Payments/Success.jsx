import React from 'react'
import { Link } from 'react-router-dom';

const Success = () => {

    return  <div className="w-60 mx-auto">
                <p className="text-white flex justify-center text-xl mt-20">Redirect to home</p>
                <Link to={"/"} className="text-white text-3xl ml-10"><i className="fa-solid fa-arrow-left"></i>  Home</Link>
            </div>
};

export default Success;
