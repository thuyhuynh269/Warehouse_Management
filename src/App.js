// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/common/side/Sidebar';
import Header from './components/common/header/ShopHeader';
import Warehouse from './pages/Warehouse/Warehouse';
import Category from './pages/Category';
import Manufacturer from './pages/Manufacturers'; // Import the Manufacturer component
import Import from "./pages/Import";
import Product from './pages/Product';
import AddWarehouse from "./pages/Warehouse/AddWarehouse"; // Import the AddWarehouse component
import Export from './pages/Export';
import { ToastContainer } from "react-toastify";
import EditWarehouse from "./pages/Warehouse/EditWarehouse";
import DetailWarehouse from "./pages/Warehouse/DetailWarehouse";
import Employee from "./pages/Employee";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Statistic from "./pages/Statistic";
import { getToken } from './components/constants';
import Transfer from "./pages/Warehouse/TransferWarehouse";
import WarehouseLogs from "./pages/Warehouse/WarehouseLogs"; // Add this import
import { jwtDecode } from 'jwt-decode';

import { useEffect, useRef, useState } from "react";

function App() {
  const headerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(window.innerHeight);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setContentHeight(window.innerHeight - headerHeight);
      }
    };

    handleResize(); // Tính lần đầu
    window.addEventListener("resize", handleResize); // Cập nhật khi resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken = decodeJwtToken(token);
      if (decodedToken && decodedToken.unique_name) {
        setName(decodedToken.unique_name);
      }

      if (decodedToken && decodedToken.role) {
       setRole(decodedToken.role.toLowerCase());
      }
    }
  }, []);
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div ref={headerRef}>
          {getToken() && <Header name={name} role={role} />}
          {/* <Header /> */}
        </div>
        <div className="flex overflow-hidden" style={{ height: `${contentHeight}px` }}>
          <ToastContainer position="bottom-right" />
          {getToken() && <Sidebar className="w-64" role={role} />}
          {/* <Sidebar className="w-64" /> */}
          <div className="flex-1 overflow-y-auto m-3 text-gray-900 font-semibold">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/warehouse/:id" element={<DetailWarehouse />} />
              <Route path="/add-warehouse" element={<AddWarehouse />} />
              <Route path="/warehouse/edit/:id" element={<EditWarehouse />} />
              <Route path="/edit-warehouse/:id" element={<EditWarehouse />} />
              <Route path="/detail-warehouse/:id" element={<DetailWarehouse />} />
              <Route path="/product" element={<Product />} />
              <Route path="/import" element={<Import />} />
              <Route path="/export" element={<Export />} />
              <Route path="/category" element={<Category />} />
              <Route path="/manufacturers" element={<Manufacturer />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/statistics" element={<Statistic />} />
              <Route path="/login" element={<Login />} />
              <Route path="/transfer-warehouse" element={<Transfer />} />
              <Route path="/warehouse-logs" element={<WarehouseLogs />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

function decodeJwtToken(token) {
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

export default App;