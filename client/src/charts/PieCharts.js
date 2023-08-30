import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import axiosPrivate from "../utils/axiosPrivate";
import { Col, Container, Row } from "react-bootstrap";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
export default function PieCharts() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const track = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        {data1.map((entry, index) => (
          <div
            key={`legend-${index}`}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: '5px',
              }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    )
  }

  const load = async () => {
    try {
      const result = await axiosPrivate.get("/analytics/orderstatus");
      const filter1 = result.data.map((item) => {
        return {
          name: item.key,
          value: item.value.value
        }
      })
      const filter2 = result.data.map((item) => {
        return {
          name: item.key,
          value: item.doc_count
        }
      })
      setData1(filter1);
      setData2(filter2);
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
        <Row>
          <h5>Order Status</h5>
          <Col className="d-flex justify-content-center">
            <PieChart width={800} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                paddingAngle={5}
                data={data1}
                cx={200}
                cy={200}
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data1.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Pie
                dataKey="value"
                data={data2}
                cx={500}
                cy={200}
                innerRadius={40}
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {data2.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            {track()}

          </Col>
        </Row>
      </Container>
    </>
  );
}
