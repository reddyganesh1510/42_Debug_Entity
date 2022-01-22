import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import "bootstrap/dist/css/bootstrap.min.css";

import './Login.css';

import { toast } from 'react-toastify';
const baseurl = 'http://localhost:5000';

function Login() {
  useEffect(async () => {
    // if (!userData.user) history.push("/login");
    const token = localStorage.getItem('auth-token');

    axios
      .post(`${baseurl}users/tokenIsValid`, null, {
        headers: { 'x-auth-token': token }
      })
      .then(
        (res) => {
          console.log(res);
          if (res.data === true) {
            navigate('../home', { replace: true });
          }
        },
        (err) => {
          navigate('../', { replace: true });

          console.log(err);
        }
      );
  }, []);
  const [signUpemail, setsignUpEmail] = useState();
  const [signUppassword, setsignUpPassword] = useState();
  const [signUppasswordCheck, setsignUpPasswordCheck] = useState();
  const [signUpdisplayName, setsignUpDisplayName] = useState();

  const navigate = useNavigate();

  const signUpsubmit = async (e) => {
    console.log('here');
    e.preventDefault();

    try {
      const newUser = {
        email: signUpemail,
        password: signUppassword,
        passwordCheck: signUppasswordCheck,
        displayName: signUpdisplayName
      };
      console.log(newUser);
      axios
        .post(`${baseurl}users/register`, newUser)
        .then((res) => {
          // console.log(res);
          localStorage.setItem('auth-token', res.data.token);
          console.log(res);

          if (res.status == 200) {
            toast.success('Sign up success');
          } else {
            toast.error(res.data.msg);
          }
        })
        .catch((err) => {
          toast.error(err);
        });

      // console.log(signupResponse + "aaaaa");
      // if (signupResponse.status == 200) {
      //   toast.success("Sign up success");
      // }
      // localStorage.setItem("auth-token", loginResponse.data.token);
      navigate('../', { replace: true });
    } catch (err) {}
  };

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [signIn, setSignIn] = useState('container mt-4 ');

  const changeToSignUp = () => {
    setSignIn('container mt-4 right-panel-active');
  };

  const changeToSignIn = () => {
    setSignIn('container mt-4 ');
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = { email, password };
      const loginResponse = await axios.post(`${baseurl}users/login`, loginUser);

      if (loginResponse.status == 200) {
        toast.success('Logged in successfully');
      }
      localStorage.setItem('auth-token', loginResponse.data.token);
      localStorage.setItem('displayName', loginResponse.data.user.displayName);

      navigate('../home', { replace: true });
    } catch (err) {
      toast.error('Please check your credentials and try again');

      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="login">
      {/* <Header /> */}
      <div className="row d-flex align-items-center" style={{ height: '110vh' }}>
        <div className={signIn} id="container">
          <div className="form-container sign-up-container">
            <form onSubmit={signUpsubmit}>
              <h3>Create Account</h3>
              {/* <div className="social-container">
                <a href="#" className="social">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social">
                  <i className="fab fa-google-plus-g" />
                </a>
                <a href="#" className="social">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
              <span>or use your email for registration</span> */}
              <input
                type="text"
                placeholder="Name"
                onChange={(e) => setsignUpDisplayName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setsignUpEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setsignUpPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm password"
                onChange={(e) => setsignUpPasswordCheck(e.target.value)}
              />

              <button type="submit" value="Register">
                Sign Up
              </button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form onSubmit={submit}>
              <h1>Sign in</h1>
              {/* <div className="social-container">
                <a href="#" className="social">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social">
                  <i className="fab fa-google-plus-g" />
                </a>
                <a href="#" className="social">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
              <span>or use your account</span> */}
              <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <a href="#">Forgot your password?</a> */}
              <button type="submit" value="Login">
                Sign In
              </button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <button onClick={changeToSignIn} className="ghost" id="signIn">
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, there!</h1>
                <p>Please sign in and start your journey with us</p>
                <button onClick={changeToSignUp} className="ghost" id="signUp">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form onSubmit={submit}>
        <label>Email: </label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password: </label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Login" className="btn btn-primary" />
      </form> */}
    </div>
  );
}

export default Login;
