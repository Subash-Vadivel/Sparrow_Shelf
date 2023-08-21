import React from 'react'
import { Navigate, redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

export default function AccessRequired(props) {
  const details = useSelector(state => state.auth.details);
  if (!details) {
    console.log("Login");
    redirect('/');
  }
  return props.children;
}