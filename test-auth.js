import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50, // number of virtual users
  duration: '60s', // total duration of the test
};

export default function () {
    // This is URL-encoded payload. I have removed the real username and password values due to Github.
    const payload = "username=a123&password=somepasswd%40123456&remember_me=false";
    
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

  // Step 1: Login with form data
  const loginRes = http.post('https://www.porticotennis.link/auth/login', payload, { headers: headers });

  check(loginRes, {
    'login successful (200)': (res) => res.status === 200,
    'got access_token_cookie': (res) =>
      res.cookies && res.cookies.access_token !== undefined,
  });

  // Step 2: Extract cookie for future requests
  const tokenCookie = loginRes.cookies.access_token[0].value;

  // Step 3: Use cookie to access authenticated route
  const bookingsRes = http.get(
    'https://www.porticotennis.link/bookings/bookings-page',
    {
      headers: {
        Cookie: `access_token_cookie=${tokenCookie}`,
      },
    }
  );

  check(bookingsRes, {
    'bookings page loads (200)': (res) => res.status === 200,
  });

  sleep(1);
}
