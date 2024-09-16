# server.py
from flask import Flask, request, jsonify
from transformers import AutoProcessor, AutoModelForCTC
import torch
import io
import numpy as np
import soundfile as sf

app = Flask(__name__)

# โหลดโมเดล
processor = AutoProcessor.from_pretrained("EUFA/wav2vec2-large-xlsr-thai-by-scamstop-final")
model = AutoModelForCTC.from_pretrained("EUFA/wav2vec2-large-xlsr-thai-by-scamstop-final")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    audio_file = request.files['file']
    audio_bytes = audio_file.read()
    
    # ใช้ soundfile เพื่ออ่านไฟล์เสียง
    audio_array, sample_rate = sf.read(io.BytesIO(audio_bytes))
    
    # ตรวจสอบอัตราการสุ่มตัวอย่าง
    if sample_rate != 16000:
        return jsonify({'error': 'Invalid sample rate. Expected 16000 Hz.'}), 400
    
    # ใช้ processor และ model สำหรับการแปลงเสียง
    inputs = processor(audio_array, return_tensors="pt", sampling_rate=16000)
    with torch.no_grad():
        logits = model(input_values=inputs.input_values).logits
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)[0]

    return jsonify({'transcription': transcription})

if __name__ == '__main__':
    app.run(debug=True)
