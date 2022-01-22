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
    'Content-Type': 'application/json',
    'x-auth-token': getToken()
  }
});

const getHelper = (route, token = getToken()) => ({
  method: 'GET',
  url: route,
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': token
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

const getUserType = () => {
  const user = getUserData();
  if(user?.firstName) {
    if(user.email === 'admin@digiblock.com') {
      return 'admin';
    }
    return  'user';
  } else {
    return 'guest'
  }
}

const displayMappings =  {
  'user' : ['dashboard','upload','profile'],
  'admin' : ['dashboard','requests','profile'],
  'guest' : ['login','register']
}

const shouldDisplayComponent = (componentName) => {
  const userType = getUserType();

  if(displayMappings[userType]?.includes(componentName)) {
    return true;
  }
  return false;
}

module.exports = {
  postHelper,
  setToken,
  getToken,
  setUserData,
  getUserData,
  clearUser,
  getHelper,
  routes,
  shouldDisplayComponent
};

