import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosPrivate from '../utils/axiosPrivate';
export default function SalesStatus() {
  const [data1, setData] = useState([]);
  const load = async () => {
    try {
      const result = await axiosPrivate.get("/analytics/salesstatus");
      const filter = result.data.map((item) => {
        return {
          name: item.key,
          uv: item.total_amount.value
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
            <AreaChart
              data={data1}
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
              <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Container>
    </>
  )
}
