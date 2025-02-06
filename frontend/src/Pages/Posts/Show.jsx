import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';


const Show = () => {

  const { post_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(post_id)

 
  return (
    <>
    {loading ? 
      (
        <div>loading</div>
      )
      : 
      (
      <div>Show
      <p>{post_id}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to={'payment'}>Payment</Link>
      </div>
      )
     }
    </>

  )
}

export default Show