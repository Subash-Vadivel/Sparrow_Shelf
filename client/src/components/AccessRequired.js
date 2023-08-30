import React from 'react'
import { redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AccessRequired(props) {
  const details = useSelector(state => state.auth.details);
  if (!details) {
    redirect('/');
  }
  return props.children;
}