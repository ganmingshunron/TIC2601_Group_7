import ReactDOM from "react-dom/client";
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VendorList from './components/VendorList';
import ProductList from './components/ProductList';
import CustomerList from './components/CustomerList';
import AdminLayout from "./pages/AdminLayout";

import './App.css';
import HomeLayout from "./pages/HomeLayout";
import Cart from "./pages/Cart";
import Register from "./pages/Register";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout/>} />
        <Route path="Cart" element={<Cart/>}/>
        <Route path="Register" element={<Register/>}/>
        <Route path="vendors" element={<VendorList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="/admin" element={<AdminLayout />}> </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
