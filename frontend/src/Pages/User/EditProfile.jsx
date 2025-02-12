import React from 'react'
import { useParams } from 'react-router-dom'

const EditProfile = () => {
  const {user_id} = useParams();
  return (
    <div>EditProfile</div>
  )
}

export default EditProfile