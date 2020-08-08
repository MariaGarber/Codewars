import React, { useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import './SectionC.css';
import axios from 'axios';

const SectionC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

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
    <div id='section-c'>
      <div className='section-c-grid'>
        <div className='section-c-text'>
          <h1>
            <span className='section-c-h1'> Don’t be a stranger</span>
            <br />
            just say hello.
          </h1>
          <p>
            Feel free to get in touch with me. I am always open to discussing
            new projects, creative ideas or opportunities to be part of your
            visions.
          </p>
          <div className='section-c-text-icons'>
            <div className='section-c-text-info'>
              <span className='material-icons section-c-icon '>
                location_on
              </span>
              <div>Ashdod, Israel</div>
            </div>
            <div className='section-c-text-info'>
              <span className='material-icons section-c-icon'>email</span>
              <div>codewarsproject@gmail.com</div>
            </div>
          </div>
        </div>

        <div className='section-c-form'>
          <input
            className='section-c-input'
            type='text'
            placeholder='Name...'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            className='section-c-input'
            type='email'
            placeholder='Email...'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <textarea
            className='section-c-textarea'
            name=''
            id=''
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
          <button className='section-c-btn' onClick={sendForm}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionC;
