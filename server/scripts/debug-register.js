import axios from 'axios';

const testRegistration = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
            email: `test_${Date.now()}@example.com`,
            password: 'password123',
            name: 'Test Runner'
        });
        console.log('SUCCESS:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('ERROR STATUS:', error.response.status);
            console.log('ERROR DATA:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('ERROR MESSAGE:', error.message);
        }
    }
};

testRegistration();
