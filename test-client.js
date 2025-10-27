const BASE_URL = 'http://localhost:3000';

const userCredentials = {
  'X-Login': 'user1',
  'X-Password': 'password123',
};

const adminCredentials = {
  'X-Login': 'admin1',
  'X-Password': 'password123',
};

const runTests = async () => {
  console.log('--- Running API Tests ---');

  // TEST 1: GET /documents (user)
  console.log('\n[TEST 1] Getting documents as a user...');
  try {
    const res = await fetch(`${BASE_URL}/documents`, { headers: userCredentials });
    console.log('Status:', res.status);
    console.log('Data:', await res.json());
  } catch (err) {
    console.error('Error:', err.message);
  }

  // TEST 2: GET /employees (user)
  console.log('\n[TEST 2] Trying to get employees as a user...');
  try {
    const res = await fetch(`${BASE_URL}/employees`, { headers: userCredentials });
    console.log('Status:', res.status);
    console.log('Data:', await res.json());
  } catch (err) {
    console.error('Error:', err.message);
  }

  // TEST 3: GET /employees (admin)
  console.log('\n[TEST 3] Getting employees as an admin...');
  try {
    const res = await fetch(`${BASE_URL}/employees`, { headers: adminCredentials });
    console.log('Status:', res.status);
    console.log('Data:', await res.json());
  } catch (err) {
    console.error('Error:', err.message);
  }

  console.log('\n--- Tests finished ---');
};

runTests();
