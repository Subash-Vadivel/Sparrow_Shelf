import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosPrivate from '../utils/axiosPrivate';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

export default function Mono() {
  const [data, setData] = useState([]);
  const load = async () => {
    try {
      const result = await axiosPrivate.get("/analytics/salesstatus");
      const filter = result.data.map((item) => {
        return {
          name: item.book_name,
          amount: item.amount,
          order: item.count
        }
      })
      setData(filter);
    }
    catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    load();
  }, [])
  return (
    <>
      <Container>
        <h5 style={{ marginBottom: "20px" }}>Sales Range</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Container>
    </>
  )
}
