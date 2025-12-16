import axios from 'axios';

const BASE_URL = 'http://localhost:3003';

async function testEndpoints() {
  console.log('Starting API Health Check...');
  console.log(`Target: ${BASE_URL}\n`);

  const endpoints = [
    {
      method: 'POST',
      url: '/api/web/login',
      data: { username: 'admin', password: 'password' }, // Dummy data
      description: 'User Login'
    },
    {
      method: 'GET',
      url: '/api/film/all',
      description: 'Get All Films'
    },
    {
      method: 'GET',
      url: '/api/cinema/room/list',
      description: 'Get Cinema Rooms'
    }
  ];

  let successCount = 0;
  let failureCount = 0;

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing [${endpoint.method}] ${endpoint.url} (${endpoint.description})...`);
      
      const config = {
        method: endpoint.method,
        url: `${BASE_URL}${endpoint.url}`,
        data: endpoint.data,
        validateStatus: (status) => true // Accept all status codes to inspect the response
      };

      const response = await axios(config);

      if (response.status >= 200 && response.status < 500) {
        // We consider 2xx, 3xx, 4xx as "Connectivity Success" (Server responded)
        // ideally 200 is best, but 401/400 means endpoint exists.
        console.log(`✅ Success: Status ${response.status}`);
        if (response.status !== 200 && response.status !== 201) {
             console.log(`   Note: Server responded with ${response.status} (Endpoint reachable)`);
        }
        successCount++;
      } else {
        console.log(`❌ Failed: Status ${response.status}`);
        console.log(`   Response:`, response.data);
        failureCount++;
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log('   Cause: Connection refused. Is the backend server running on port 3003?');
      }
      failureCount++;
    }
    console.log('---');
  }

  console.log(`\nTest Complete.`);
  console.log(`Total: ${endpoints.length}, Success: ${successCount}, Failed: ${failureCount}`);
  
  if (failureCount > 0) {
      process.exit(1);
  }
}

testEndpoints();
