import React from 'react'
import Header from '../components/Header'
import PieCharts from '../charts/PieCharts'
import SalesStatus from '../charts/SalesStatus'
import LineChartSales from '../charts/LineChartSales'
import Funnel from '../charts/Funnel'
import Mono from '../charts/Mono'

export default function Dashboard() {
  return (
    <>
      <Header />
      <PieCharts />
      <SalesStatus />
      <LineChartSales />
      <Mono />
      <Funnel />
    </>
  )
}
