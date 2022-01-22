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

const getToken = (token) => {
  localStorage.getItem('auth-token');
};

module.exports = { postHelper, setToken, getToken };
