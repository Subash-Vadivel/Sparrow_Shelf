import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosPrivate from '../utils/axiosPrivate';

function LineChartSales() {
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

    <Container style={{ marginTop: "30px" }}>
      <h5 style={{ marginBottom: "20px" }}> Earnings</h5>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );

}
export default LineChartSales;
