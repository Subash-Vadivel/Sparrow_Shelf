import React from 'react'
import Header from '../components/Header'
import PieCharts from '../charts/PieCharts'
import SalesStatus from '../charts/SalesStatus'

export default function Dashboard() {
  return (
    <>
      <Header />
      <PieCharts />
      <SalesStatus />
    </>
  )
}
