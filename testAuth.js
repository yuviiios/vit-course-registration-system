/**
 * Authentication API Test Suite
 * Tests JWT auth + Google OAuth endpoints
 *
 * Usage:
 * 1. Start server: npm run dev
 * 2. Run tests: node testAuth.js
 */

const BASE_URL = 'http://localhost:3000/api';

let accessToken = '';
let refreshToken = '';
let testStudent = {
  registrationNumber: `21BCE${Math.floor(Math.random() * 10000)}`,
  name: 'Test Student',
  email: `test${Math.floor(Math.random() * 10000)}@vitstudent.ac.in`,
  password: 'Test@12345',
  branch: 'CSE',
  semester: 1,
};

async function testAPI(method, endpoint, body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

async function runTests() {
  console.log('\n🧪 VIT Course Registration - Auth API Tests\n');
  console.log('=' .repeat(60));

  // Test 1: Register with college email
  console.log('\n📝 Test 1: Register with valid VIT email');
  const registerResult = await testAPI('POST', '/auth/register', testStudent);
  console.log(`Status: ${registerResult.status}`);
  console.log(`Response:`, JSON.stringify(registerResult.data, null, 2));

  if (registerResult.status === 201) {
    console.log('✅ Registration successful');
    accessToken = registerResult.data.data.accessToken;
    refreshToken = registerResult.data.data.refreshToken;
  } else {
    console.log('❌ Registration failed');
  }

  // Test 2: Register with non-VIT email (should fail)
  console.log('\n📝 Test 2: Register with non-VIT email (should fail)');
  const invalidStudent = {
    ...testStudent,
    registrationNumber: `21BCE${Math.floor(Math.random() * 10000)}`,
    email: 'test@gmail.com',
  };
  const invalidRegResult = await testAPI('POST', '/auth/register', invalidStudent);
  console.log(`Status: ${invalidRegResult.status}`);
  console.log(`Response:`, JSON.stringify(invalidRegResult.data, null, 2));

  if (invalidRegResult.status === 400 || invalidRegResult.status === 500) {
    console.log('✅ Correctly rejected non-VIT email');
  } else {
    console.log('❌ Should have rejected non-VIT email');
  }

  // Test 3: Login with correct credentials
  console.log('\n📝 Test 3: Login with correct credentials');
  const loginResult = await testAPI('POST', '/auth/login', {
    email: testStudent.email,
    password: testStudent.password,
  });
  console.log(`Status: ${loginResult.status}`);
  console.log(`Response:`, JSON.stringify(loginResult.data, null, 2));

  if (loginResult.status === 200) {
    console.log('✅ Login successful');
    accessToken = loginResult.data.data.accessToken;
    refreshToken = loginResult.data.data.refreshToken;
  } else {
    console.log('❌ Login failed');
  }

  // Test 4: Login with wrong password
  console.log('\n📝 Test 4: Login with wrong password (should fail)');
  const wrongPassResult = await testAPI('POST', '/auth/login', {
    email: testStudent.email,
    password: 'WrongPassword123',
  });
  console.log(`Status: ${wrongPassResult.status}`);
  console.log(`Response:`, JSON.stringify(wrongPassResult.data, null, 2));

  if (wrongPassResult.status === 400 || wrongPassResult.status === 500) {
    console.log('✅ Correctly rejected wrong password');
  } else {
    console.log('❌ Should have rejected wrong password');
  }

  // Test 5: Access protected route without token
  console.log('\n📝 Test 5: Access protected route without token (should fail)');
  const noTokenResult = await testAPI('GET', '/auth/me');
  console.log(`Status: ${noTokenResult.status}`);
  console.log(`Response:`, JSON.stringify(noTokenResult.data, null, 2));

  if (noTokenResult.status === 401) {
    console.log('✅ Correctly rejected request without token');
  } else {
    console.log('❌ Should have required authentication');
  }

  // Test 6: Access protected route with valid token
  console.log('\n📝 Test 6: Get profile with valid token');
  const profileResult = await testAPI('GET', '/auth/me', null, accessToken);
  console.log(`Status: ${profileResult.status}`);
  console.log(`Response:`, JSON.stringify(profileResult.data, null, 2));

  if (profileResult.status === 200) {
    console.log('✅ Successfully retrieved profile');
  } else {
    console.log('❌ Failed to retrieve profile');
  }

  // Test 7: Update profile
  console.log('\n📝 Test 7: Update profile');
  const updateResult = await testAPI('PUT', '/auth/me', {
    name: 'Updated Test Student',
    phone: '9876543210',
    semester: 2,
  }, accessToken);
  console.log(`Status: ${updateResult.status}`);
  console.log(`Response:`, JSON.stringify(updateResult.data, null, 2));

  if (updateResult.status === 200) {
    console.log('✅ Profile updated successfully');
  } else {
    console.log('❌ Profile update failed');
  }

  // Test 8: Refresh token
  console.log('\n📝 Test 8: Refresh access token');
  const refreshResult = await testAPI('POST', '/auth/refresh', {
    refreshToken: refreshToken,
  });
  console.log(`Status: ${refreshResult.status}`);
  console.log(`Response:`, JSON.stringify(refreshResult.data, null, 2));

  if (refreshResult.status === 200) {
    console.log('✅ Token refreshed successfully');
    accessToken = refreshResult.data.data.accessToken;
  } else {
    console.log('❌ Token refresh failed');
  }

  // Test 9: Access with refreshed token
  console.log('\n📝 Test 9: Access profile with refreshed token');
  const newProfileResult = await testAPI('GET', '/auth/me', null, accessToken);
  console.log(`Status: ${newProfileResult.status}`);

  if (newProfileResult.status === 200) {
    console.log('✅ Refreshed token works correctly');
  } else {
    console.log('❌ Refreshed token failed');
  }

  // Test 10: Logout
  console.log('\n📝 Test 10: Logout');
  const logoutResult = await testAPI('POST', '/auth/logout', null, accessToken);
  console.log(`Status: ${logoutResult.status}`);
  console.log(`Response:`, JSON.stringify(logoutResult.data, null, 2));

  if (logoutResult.status === 200) {
    console.log('✅ Logout successful');
  } else {
    console.log('❌ Logout failed');
  }

  // Google OAuth info
  console.log('\n' + '='.repeat(60));
  console.log('\n🔐 Google OAuth Endpoints:');
  console.log(`   Initiate: ${BASE_URL}/auth/google`);
  console.log(`   Callback: ${BASE_URL}/auth/google/callback`);
  console.log('\n   ⚠️  Google OAuth requires configuration in Google Cloud Console');
  console.log('   📖 See GOOGLE_OAUTH_SETUP.md for detailed instructions');

  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Test suite completed!\n');
  console.log('📊 Test Credentials Used:');
  console.log(`   Email: ${testStudent.email}`);
  console.log(`   Registration Number: ${testStudent.registrationNumber}`);
  console.log(`   Password: ${testStudent.password}`);
  console.log('\n💡 These credentials are now in the database for manual testing\n');
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
