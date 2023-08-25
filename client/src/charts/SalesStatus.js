import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import axiosPrivate from '../utils/axiosPrivate';
export default function SalesStatus() {
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
        <h5 style={{ marginBottom: "20px" }}> Sales</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis dataKey="order" />
              <Tooltip />
              <Legend />
              <Bar dataKey="order" fill="#00C49F" />
            </BarChart>

          </ResponsiveContainer>
        </div>
      </Container>
    </>
  )
}
