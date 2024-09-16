import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import { postData } from './apiService'; // นำเข้าฟังก์ชันจาก apiService.js
import './Dashboard.css'; // นำเข้าไฟล์ CSS ของ Dashboard

const Dashboard = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const navigate = useNavigate(); // สร้างตัวแปร navigate

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'th-TH'; // เปลี่ยนเป็นภาษาที่ต้องการ

      recognitionInstance.onresult = async (event) => {
        const result = event.results[event.resultIndex];
        if (result.isFinal) {
          const transcriptText = result[0].transcript;
          setTranscript((prev) => prev + transcriptText + ' ');
          // ส่งข้อความไปยัง backend
          try {
            await postData({ transcript: transcriptText });
          } catch (error) {
            console.error('Error posting data:', error);
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition API is not supported in this browser.');
    }
  }, []);

  const handleMicClick = () => {
    if (recognition) {
      if (isRecording) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsRecording(!isRecording);
    }
  };

  const handleLogout = () => {
    // ลบข้อมูล token ออกจาก localStorage
    localStorage.removeItem('token');
    // เปลี่ยนเส้นทางไปที่หน้า sign-in
    navigate('/sign-in');
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  const saveAsNote = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transcript.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main>
        <h2>Welcome to Your Dashboard</h2>
        <div className="mic-container" onClick={handleMicClick}>
          <div className={`mic-icon ${isRecording ? 'recording' : ''}`}></div>
        </div>
        <div className="message-box">
          <p>{transcript || 'No messages yet.'}</p>
        </div>
        <button className="clear-button" onClick={clearTranscript}>เคลียร์ข้อความ</button>
        <button className="save-button" onClick={saveAsNote}>Save as Note</button>
      </main>
    </div>
  );
};

export default Dashboard;
