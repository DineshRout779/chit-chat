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
    // Token doesn't exist, consider it expired
    return true;
  }

  // Decode the middle part of the token
  const decodedToken = JSON.parse(atob(token.split('.')[1]));

  // console.log('decoded: ', decodedToken);

  // console.log(
  //   'Dates: ',
  //   new Date(Date.now()).toTimeString(),
  //   new Date(decodedToken.exp * 1000).toTimeString()
  // );

  // Check if the current time is greater than the token's expiration time
  return Date.now() >= decodedToken.exp * 1000;
};
