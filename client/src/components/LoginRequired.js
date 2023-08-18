import React from 'react'
import { Navigate, useLocation,redirect, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

export default function LoginRequired(props) {
  const details = useSelector(state => state.auth.details);
    const location=useLocation();
    if(!details.isadmin)
    {
      console.log("False");
        return <Navigate to="/"></Navigate>;
    }
  return props.children;
}