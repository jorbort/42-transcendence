addEventListenerdocument.addEventListener('DOMContentLoaded', function() {
  const accessToken = getCookie('access_token');
  const refreshToken = getCookie('refresh_token');

  if (!accessToken) {
    // Redirect to login page if not authenticated
    window.location.href = '/login';
  } else {
    // Fetch and display protected content
    fetchProtectedContent(accessToken);
  }
});

function fetchProtectedContent(token) {
	handleRouteChange();
}

function refreshAccessToken() {
  const refreshToken = getCookie('refresh_token');
  if (!refreshToken) {
    // Redirect to login page if no refresh token is available
    window.location.href = '/login';
    return;
  }

  return fetch('http://localhost:8000/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: refreshToken })
  })
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      // Update the access token cookie
      document.cookie = `access_token=${data.access_token}; path=/`;
      // Retry fetching the protected content
      return fetchProtectedContent(data.access_token);
    } else {
      // Redirect to login page if refresh token is invalid
      window.location.href = '/login';
    }
  })
  .catch(error => {
    window.location.href = '/login';
  });
}