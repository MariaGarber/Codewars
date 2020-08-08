import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './Login.css';
import axios from 'axios';
import { setCookie } from '../../cookies';
import NavBarLogin from '../NavBar/NavBarLogin/NavBarLogin';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import { confirmAlert } from 'react-confirm-alert';
import loadingIcon from '../../assets/loading-axios.gif'



const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [show, setShow] = useState('');
  const [forgetPass, setForgetPass] = useState('');

  const checkUser = () => {
    let loginBtn = document.querySelector('.login-btn')
    let img = document.querySelector('.loading-icon')
    img.style.display = 'block'
    loginBtn.style.display = 'none'

    let tmp = {};
    tmp.email = email;
    tmp.password = password;
    tmp.lastSeen = lastSeenDate();
    axios
      .post('https://codewars-project.herokuapp.com/login', tmp)
      .then((response) => {
        img.style.display = 'none'
        loginBtn.style.display = 'block'

        if (!response.data.id) {
          setErr(response.data);
          setShow(true);
          setTimeout(() => {
            setErr('');
          }, 6000);

          setTimeout(() => {
            setShow(false);
          }, 6250);
        } else {
          setCookie('id', response.data.id, 0.25);
          setCookie('name', response.data.name, 0.25);
          setCookie('exp', response.data.exp, 0.25);
          setCookie('level', response.data.level, 0.25);
          setCookie('profilePic', response.data.pic, 0.25);
          props.history.push({ pathname: '/' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const lastSeenDate = () => {
    let d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let fullDate = day + '/' + month + '/' + year;
    return fullDate;
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '70%',
      marginTop: '2%',
      marginLeft: '15%',
      marginBottom: '2%',
    },
  }));
  const classes = useStyles();

  const forgetPassword = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <p>Enter your email address:</p>
            <input
              className='login-input-alert'
              type='email'
              placeholder='Email...'
              onChange={(e) => setForgetPass(e.target.value)}
            />
            <div>
              <button
                className='room-btn-alert'
                onClick={() => {
                  sendPass(forgetPass);
                  
                  confirmAlert({
                    customUI: ({ onClose }) => {
                      return (
                        <div className='custom-ui'>
                          <p>
                            If the email address exists in the system, a message
                            will be sent to your email address
                          </p>
                          <button
                            onClick={() => onClose()}
                            className='room-btn-alert'
                          >
                            Ok
                          </button>
                        </div>
                      );
                    },
                  });
                }}
              >
                Ok
              </button>
              <button
                className='room-btn-alert'
                onClick={() => {
                  onClose();
                }}
              >
                Close
              </button>
            </div>
 
          </div>
        );
      },
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
  };

  const loginByPress = (e) =>{
    if(e.key === 'Enter')
      checkUser()
  }

  const sendPass = (email) => {
    console.log('login');
    axios({
      method: 'get',
      url: 'https://codewars-project.herokuapp.com/forgetpassword',
      params: {
        email,
      },
    })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='full-height'>
      <NavBarLogin />
      <div className='login-container'>
        <div className='login-left'>
          <div className='login-left-form-container'>
            <h1>Sign in to Codewars</h1>
            {show ? (
              <div className={classes.root}>
                <Fade in={err}>
                  <Alert severity='error' variant='filled'>
                    {err}
                  </Alert>
                </Fade>
              </div>
            ) : null}
            <div className='login-input-div'>
              <i className='material-icons login-icon'>email</i>
              <input
                className='login-input'
                type='email'
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='login-input-div'>
              <i className='material-icons login-icon '>lock</i>
              <input
                className='login-input'
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => loginByPress(e)}
              />
            </div>

            <div className='forget-pass-div'>
              <Link className='forget-pass' to='#' onClick={forgetPassword}>
                Forget your password?
              </Link>
              <div id='forget-pass-hr'></div>
              <div className='loading-and-btn'>
                <button className='login-btn' onClick={checkUser}>
                  SIGN IN
                </button>
                <img className="loading-icon" src={loadingIcon} alt=""/>
              </div>
  
            </div>
          </div>
        </div>

        <div className='login-right'>
          <div className='login-right-text-container'>
            <h1>First Time Here?</h1>
            <p>Enter your personal details</p>
            <p>and start journey with us</p>
            <Link to='/register'>
              <button id='sigh-up-btn'>SIGN UP</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

