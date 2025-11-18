const http = require('http');

function testLogin() {
  console.log('Testing admin login API...');

  const postData = JSON.stringify({
    email: 'aronnosaha161.dopamine@gmail.com',
    password: '@Ronna$1618151311181514141.dopamine'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    res.setEncoding('utf8');
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Response:', data);
      } catch (e) {
        console.log('Raw response:', body);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

testLogin();