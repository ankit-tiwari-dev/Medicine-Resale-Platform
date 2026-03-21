import fs from 'fs';
import { resolve } from 'path';

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function runTest() {
  try {
    console.log('1. Logging in as testuser_final@example.com...');
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser_final@example.com',
        password: 'Password123!'
      })
    });
    
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    
    const cookies = loginRes.headers.get('set-cookie');
    const token = loginData.accessToken || loginData.token;
    
    console.log('2. Simulating bypass form submission...');
    const formData = new FormData();
    const imagePath = 'C:\\Users\\olive\\.gemini\\antigravity\\brain\\9fdfbaf1-4af3-4fa4-b17c-e2da493ad7f4\\test_medicine_pack_1774044631847.png';
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    
    formData.append('image', imageBlob, 'test_medicine.png');
    formData.append('name', 'Generic Paracetamol API Test');
    formData.append('genericName', 'Paracetamol');
    formData.append('manufacturer', 'Micro Labs');
    formData.append('batchNumber', 'B123456');
    formData.append('expiryDate', '2026-12-31');
    formData.append('stock', '15');
    formData.append('originalPrice', '250');
    formData.append('description', 'High quality generic paracetamol generated via API bypass test.');
    
    const headers = {
      Authorization: `Bearer ${token}`
    };
    if (cookies) headers.Cookie = cookies;

    const uploadRes = await fetch(`${API_BASE_URL}/medicines/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    const uploadData = await uploadRes.json();
    console.log('Upload Result:', uploadRes.status, uploadData.message);
    
    console.log('3. Verifying in My Medicines...');
    const myMedsRes = await fetch(`${API_BASE_URL}/medicines/my-medicines`, {
      headers
    });
    const myMedsData = await myMedsRes.json();
    
    const listedMed = myMedsData.data?.find(m => m.name === 'Generic Paracetamol API Test');
    if (listedMed) {
      console.log('SUCCESS: Medicine found in inventory!');
      console.log(`Status: ${listedMed.status}, Brand: ${listedMed.name}, ID: ${listedMed._id}`);
    } else {
      console.error('FAILURE: Medicine not found in inventory after upload.');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTest();
