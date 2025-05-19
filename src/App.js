// App.jsx
import React from "react";
import { BrowserRouter, Routes,Route  } from "react-router-dom";
import Sidebar from './components/common/side/Sidebar';
import Header from './components/common/header/ShopHeader';
import Warehouse from './pages/Warehouse'; 
import Category from './pages/Category'; // Import the Category component

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="flex gap-2">
        <Sidebar />
        <div className="m-3 w-full text-gray-900 font-semibold">
          <Routes>
            <Route path="/" element={<Warehouse />} />
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/category" element={<Category />} /> {/* Add the route for Category */}
            {/* Add more routes as needed */}
          </Routes> {/* Render the Warehouse component here */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;