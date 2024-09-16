// src/__tests__/SignIn.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import SignIn from '../SignInn'; // นำเข้าไฟล์ที่ถูกต้อง

test('renders sign in form', () => {
  render(<SignIn />);
  
  // ตรวจสอบว่ามีฟอร์มสำหรับลงชื่อเข้าใช้
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  
  // ตรวจสอบว่ามีปุ่มลงชื่อเข้าใช้
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});

test('displays error message for invalid email', () => {
  render(<SignIn />);
  
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalidemail' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  // ตรวจสอบว่ามีข้อความผิดพลาดปรากฏ
  expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
});
