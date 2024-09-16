import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './SignInn';
import SignUp from './SignUpp';
import Dashboard from './Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} /> {/* หน้าแรก */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
