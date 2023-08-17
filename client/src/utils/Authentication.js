import axios from "./axiosPrivate"
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
export const userStatus = React.createContext();
export default function Authentication(props) {

  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [details, setDetails] = useState(JSON.parse(localStorage.getItem('details')))
  const login = (data) => {
    localStorage.setItem('user', data.email);
    localStorage.setItem('details', JSON.stringify(data));
    setUser(data.email);
    console.log(data.firstName);
  }
  const logout = async () => {

    try {
      await axios.post('/logout');
      setUser(false);
      localStorage.removeItem('user')

      localStorage.removeItem('details')
      navigate("/");
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <userStatus.Provider value={{ user, login, logout, details }}>
        {props.children}
      </userStatus.Provider>

    </>
  )
}
export const useAuth = () => { return useContext(userStatus) };