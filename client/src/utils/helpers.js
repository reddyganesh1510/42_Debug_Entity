const baseRoute = 'http://192.168.1.208:3000/documents/api';

const routes = {
  userLogin: `${baseRoute}/user/login`,
  userRegister: `${baseRoute}/user/register`,
  userProfile: `${baseRoute}/user`,
  adminLogin: `${baseRoute}/admin/login`,
  adminRegister: `${baseRoute}/admin/register`
}

const postHelper = (obj, route) => ({
  method: 'POST',
  url: route,
  data: obj,
  headers: {
    'Content-Type': 'application/json'
  }
});

const getHelper = (route) => ({
  method: 'GET',
  url: route,
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': getToken()
  }
})

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
  return localStorage.getItem('auth-token');
};

const clearUser = () => {
  localStorage.removeItem('user-data');
  localStorage.removeItem('auth-token');
};

module.exports = { postHelper, setToken, getToken, setUserData, getUserData, clearUser, getHelper, routes };
