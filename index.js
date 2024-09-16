import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // ตรวจสอบว่า App.js มีการส่งออก default
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // สร้าง root

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
