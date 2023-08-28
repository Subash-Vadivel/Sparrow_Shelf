import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import PieCharts from '../charts/PieCharts'
import SalesStatus from '../charts/SalesStatus'
import io from "socket.io-client";
const socket = io("http://localhost:8082");
export default function Dashboard() {
  const [orderdata, setOrderData] = useState([]);
  const [bookdata, setBookData] = useState([]);

  useEffect(() => {
    socket.emit("orderStatus");
    socket.emit("bookSales")
    socket.on("newUser", (id) => {
      console.log("New user : " + id);
    })
    socket.on("orderStatusResponse", (data) => {
      console.log(data)
      setOrderData(() => data);
    })
    socket.on("booksSalesResponse", (data) => {
      console.log(data)
      setBookData(() => data);
    })
  }, [])
  return (
    <>
      <Header />
      <PieCharts data={orderdata} />
      <SalesStatus data={bookdata} />
    </>
  )
}
