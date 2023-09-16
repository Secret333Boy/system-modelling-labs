import React, { useEffect, useState } from 'react';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';

function App() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  const fetchData = async () => {
    const res = await fetch('http://localhost:5000/one');
    setData1(await res.json());

    const res2 = await fetch('http://localhost:5000/two');
    setData2(await res2.json());

    const res3 = await fetch('http://localhost:5000/three');
    setData3(await res3.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <BarChart width={730} height={250} data={data1}>
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="y" fill="#8884d8" />
      </BarChart>
      <BarChart width={730} height={250} data={data2}>
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="y" fill="#8884d8" />
      </BarChart>
      <BarChart width={730} height={250} data={data3}>
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="y" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default App;
