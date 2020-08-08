import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import axios from 'axios';
import './ForgetPassword.css'
import ForgetpassNav from '../NavBar/ForgetpassNav/ForgetpassNav';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';


const ForgetPassword = (props) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');


  useEffect(() => {
    const { id } = queryString.parse(window.location.search);
    setUserId(id);
  }, []);


  const useStyles = makeStyles((theme) => ({
    root: {
      width: '80%',
      margin:'10px auto'
     
    },
  }));
  const classes = useStyles();

  const myAlert = (alert, func) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h2>{alert}</h2>
            <button
              onClick={
                func
                  ? () => {
                      onClose();
                      props.history.push({ pathname: '/login' });
                    }
                  : () => onClose()
              }
              className='room-btn-alert'
            >
              Ok
            </button>
          </div>
        );
      },
    });
  };

  const changePassword = () => {
    if (password === confirmPassword) {
      axios
        .post('https://codewars-project.herokuapp.com/updatepassword', { id: userId, password })
        .then((response) => {
          if (response.data !== true) {
            setErr(response.data);
            setShow(true);

            setTimeout(() => {
              setErr('');
            }, 6000);
  
            setTimeout(() => {
              setShow(false);
            }, 6250);
          } else {
            myAlert('Your password updated', true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setErr('passwords not match');
      setShow(true);

      setTimeout(() => {
        setErr('');
      }, 6000);

      setTimeout(() => {
        setShow(false);
      }, 6250);
    }
  };

  return (
    <div className="forget-password">
      <ForgetpassNav/>
      <div className="forget-password-center">
        <h2>Codewars</h2>
        <input
          type='password'
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type='password'
          placeholder='Confirm password'
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={changePassword}>Submit</button>

        {show ? (
          <div className={classes.root}>
            <Fade in={err}>
              <Alert severity='error' variant='filled'>
                {err}
              </Alert>
            </Fade>
          </div>
        ) : null}

      </div>

    </div>
  );
};

export default ForgetPassword;
