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

function App() {
  const headerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(window.innerHeight);

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

  return (
    <BrowserRouter>
      <Header />
      <div className="flex gap-2">
        <Sidebar />
        <div className="m-3 w-full text-gray-900 font-semibold">
          <Routes>
            <Route path="/" element={<Warehouse />} />
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/warehouse/:id" element={<DetailWarehouse />} />
            <Route path="/warehouse/edit/:id" element={<EditWarehouse />} />
            <Route path="/category" element={<Category />} /> 
            <Route path="/manufacturers" element={<Manufacturer/>} />
            <Route path="/product" element={<Product/>} />
            <Route path="/add-warehouse" element={<AddWarehouse />} /> {/* Add the route for AddWarehouse */}
            <Route path="/export" element={<Export />} /> {/* Add Export route */}
            <Route path="/add-warehouse" element={<AddWarehouse />} />
            <Route path ="/edit-warehouse/:id" element={<EditWarehouse />} />
            <Route path="/detail-warehouse/:id" element={<DetailWarehouse />} />
            <Route path="/detail-warehouse/:id" element={<DetailWarehouse />}/>
            <Route path="/login" element={<Login/>} />
            
            
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
export default App;