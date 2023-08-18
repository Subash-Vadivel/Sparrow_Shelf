import React, { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'
export default function Unauthrized() {
  const navigate=useNavigate();
  useEffect(()=>{
   navigate('/')
  },[])
  return (
    <div>Unauthorized</div>
  )
}
