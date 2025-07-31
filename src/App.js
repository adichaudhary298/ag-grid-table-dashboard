import React from 'react';
import DataGrid from './components/DataGrid';
import { rowData } from './data/sampleData';

const App = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>FactWise Dashboard</h2>
      <DataGrid rowData={rowData} />
    </div>
  );
};

export default App;
