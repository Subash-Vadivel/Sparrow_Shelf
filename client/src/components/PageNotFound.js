import React, { useEffect } from 'react'
import { redirect, useNavigate } from 'react-router-dom'

export default function PageNotFound() {
  
  const navigate=useNavigate();
  useEffect(()=>{
    navigate('/');

  },[])

  return (
    <div>PageNotFound</div>
  )
}
