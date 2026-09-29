// Retrieve token from localStorage
export const getToken = () => {
  return localStorage.getItem('token') || null;
};

// Remove token from localstorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// check if token is valid or expired or doesnt exists
export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return true;
    }

    const decodedToken = JSON.parse(atob(payload));

    if (!decodedToken.exp) {
      return true;
    }

    return Date.now() >= decodedToken.exp * 1000;
  } catch (error) {
    console.error('Invalid token:', error);
    return true;
  }
};
