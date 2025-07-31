
// export default DataGrid;
import React, { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import 'ag-grid-community/styles/ag-theme-alpine-dark.css';

const DataGrid = ({ rowData }) => {
  const [gridApi, setGridApi] = useState(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [theme, setTheme] = useState('ag-theme-alpine');
  const [data, setData] = useState(rowData);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', age: '', country: '', email: '' });

  const gridRef = useRef(null);

  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Age', field: 'age', sortable: true, filter: true },
    { headerName: 'Country', field: 'country', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onQuickFilterChange = (e) => {
    setQuickFilter(e.target.value);
    gridApi?.setQuickFilter(e.target.value);
  };

  const exportToCSV = () => {
    gridApi?.exportDataAsCsv();
  };

  const toggleTheme = () => {
    setTheme(theme === 'ag-theme-alpine' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine');
  };

  const deleteSelectedRows = () => {
    const selected = gridRef.current.api.getSelectedRows();
    const remaining = data.filter(d => !selected.some(s => s.id === d.id));
    setData(remaining);
  };

  const openModal = (isEdit = false) => {
    if (isEdit) {
      const selected = gridRef.current.api.getSelectedRows();
      if (selected.length !== 1) {
        alert('Please select one row to edit');
        return;
      }
      setForm({ ...selected[0] });
      setEditIndex(data.findIndex(d => d.id === selected[0].id));
    } else {
      setForm({ id: '', name: '', age: '', country: '', email: '' });
      setEditIndex(null);
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...data];
    if (editIndex !== null) {
      updated[editIndex] = form;
    } else {
      updated.push(form);
    }
    setData(updated);
    setShowModal(false);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ marginBottom: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          placeholder="Search..."
          value={quickFilter}
          onChange={onQuickFilterChange}
          style={{ padding: '6px', width: '200px' }}
        />
        <button onClick={exportToCSV}>Export CSV</button>
        <button onClick={toggleTheme}>Toggle Dark Mode</button>
        <button onClick={deleteSelectedRows}>Delete Selected</button>
        <button onClick={() => openModal(false)}>Add Record</button>
        <button onClick={() => openModal(true)}>Edit Record</button>
      </div>

      <div className={theme} style={{ height: 500, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          rowSelection="multiple"
          domLayout="autoHeight"
        />
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleSubmit} style={{
            backgroundColor: '#fff', padding: 20, borderRadius: 10,
            display: 'flex', flexDirection: 'column', gap: 10, minWidth: 300
          }}>
            <h3>{editIndex !== null ? 'Edit Record' : 'Add Record'}</h3>
            <input placeholder="ID" value={form.id} onChange={e => setForm({ ...form, id: Number(e.target.value) })} required />
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: Number(e.target.value) })} required />
            <input placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DataGrid;

