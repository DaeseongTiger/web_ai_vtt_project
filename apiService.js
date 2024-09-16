// src/apiService.js
export const postData = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('http://localhost:3333/transcribe', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  };
  