import React, { useState, useEffect } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import './Contact.css';
import axios from 'axios';
import LoggedInNav from '../NavBar/LoggedInNav/LoggedInNav';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { getCookie } from '../../cookies';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#42BB92',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#42BB92',
    },
    width: 250,
  },
})(TextField);

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios({
      method: 'get',
      url: 'https://codewars-project.herokuapp.com/getcontactdata',
      params: {
        cookie: getCookie('id'),
      },
    })
      .then((response) => {
        if (response.data.name) {
          setName(response.data.name);
          setEmail(response.data.email);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const sendForm = () => {
    axios
      .post('https://codewars-project.herokuapp.com/sendContactForm', {
        name,
        email,
        description,
      })
      .then((response) => {
        if (response.data === true) {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='custom-ui'>
                  <h1>Your email was successfully sent</h1>
                  <button
                    onClick={() => {
                      setName('');
                      setEmail('');
                      setDescription('');
                      onClose();
                    }}
                    className='room-btn-alert'
                  >
                    Ok
                  </button>
                </div>
              );
            },
          });
        } else alert(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <LoggedInNav />
      <div className={'contact-main'}>
        <div className={'contact-container'}>
          <div className={'contact-inforamation'}>
            <div className={'contact-information-inside'}>
              <h2>Contact Us</h2>
              <div className={'contact-location'}>
                <span className='material-icons-outlined'>location_on</span>
                <label>Ashdod, Israel</label>
              </div>
              <div className={'contact-email'}>
                <span className='material-icons-outlined'>email</span>
                <label> codewarsproject@gmail.com</label>
              </div>
            </div>
          </div>
          <div className={'contact-form'}>
            <h1>Stay in Touch</h1>
            <p>
              Feel free to contact us with any problem, question or request!
            </p>
            <div className={'contact-text-feild'}>
              <CssTextField
                label='Name'
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className={'contact-text-feild'}>
              <CssTextField
                label='Email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className={'contact-text-feild'}>
              <CssTextField
                id='contact-text-area'
                label='Description'
                multiline
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>
            <button className='contact-btn' onClick={sendForm}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
