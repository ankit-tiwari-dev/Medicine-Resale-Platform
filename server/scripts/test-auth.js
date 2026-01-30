const testAuth = async () => {
    const baseURL = 'http://localhost:5000/api/v1';
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'Test123!';

    console.log('Testing Authentication Endpoints...\n');

    // Test 1: Register a new user
    console.log('1. Testing Registration...');
    try {
        const registerResponse = await fetch(`${baseURL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword,
                name: 'Test User'
            })
        });

        const registerData = await registerResponse.json();
        console.log('✓ Registration Status:', registerResponse.status);
        console.log('✓ Registration Response:', JSON.stringify(registerData, null, 2));

        if (registerResponse.status === 201) {
            console.log('✓ Registration successful!\n');

            // Test 2: Try to login (should fail - not verified)
            console.log('2. Testing Login with same credentials (should fail - not verified)...');
            const loginResponse = await fetch(`${baseURL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testEmail,
                    password: testPassword
                })
            });

            const loginData = await loginResponse.json();
            console.log('✓ Login Status:', loginResponse.status);
            console.log('✓ Login Response:', JSON.stringify(loginData, null, 2));

            if (loginResponse.status === 403) {
                console.log('✓ Login correctly blocked for unverified user!\n');
            }
        }
    } catch (error) {
        console.error('✗ Error:', error.message);
    }
};

testAuth();
