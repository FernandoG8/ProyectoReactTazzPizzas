// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Navbar'; 

const AdminLayout = () => {
  return (
    <div className="admin-layout d-flex">
      <Sidebar />
      <main className="admin-content flex-grow-1" style={{ paddingLeft: '230px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;