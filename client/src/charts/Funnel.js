import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import axiosPrivate from '../utils/axiosPrivate';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const data1 = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];


export default function Funnel() {

  const [data, setData] = useState([]);
  const load = async () => {
    try {
      const result = await axiosPrivate.get("/analytics/salesstatus");
      const filter = result.data.map((item) => {
        return {
          name: item.book_name,
          x: item.amount, //amount
          y: item.count   //count
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

      <Container style={{ marginTop: "30px" }}>
        <h5 style={{ marginBottom: "20px" }}> Orders Profit</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <ScatterChart
              width={400}
              height={400}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Amount" unit="rs" />
              <YAxis type="number" dataKey="y" name="Orders" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="top sales" data={data} fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}

              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

        </div>
      </Container>
    </>
  )
}
