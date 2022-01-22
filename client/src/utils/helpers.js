const postHelper = (obj) => ({
  method: 'POST',
  url: 'http://192.168.1.208:3000/documents/api/user/register',
  data: obj,
  headers: {
    'Content-Type': 'application/json'
  }
});

const setToken = (token) => {
  localStorage.setItem('auth-token', token);
};

const setUserData = (data) => {
  localStorage.setItem('user-data', JSON.stringify(data));
};

const getUserData = () => {
  const res = localStorage.getItem('user-data');
  return JSON.parse(res);
};

const getToken = (token) => {
  localStorage.getItem('auth-token');
};

const clearUser = () => {
  localStorage.removeItem('user-data');
  localStorage.removeItem('auth-token');
};

module.exports = { postHelper, setToken, getToken, setUserData, getUserData, clearUser };
