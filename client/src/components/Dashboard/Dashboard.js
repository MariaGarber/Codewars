import React, { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import './Dashboard.css';
import LoggedInNav from '../NavBar/LoggedInNav/LoggedInNav';
import ma from '../../assets/ma.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCookie } from '../../cookies';

const Dashboard = () => {
  const [end, setEnd] = useState(false);

  useEffect(() => {
    axios
      .get('https://codewars-project.herokuapp.com/getendtest', {
        params: {
          pid: getCookie('id'),
        },
      })
      .then((response) => {
        setEnd(response.data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className='dashboard'>
      <LoggedInNav />

      <div className='dashboard-container'>
        <div className='dashboard-left'>
          <div className='dashboard-left-container'>
            <h1>Start competing with other users around the world</h1>
            <p>
              A new way to learn and improve your programming skills by compete
              in a fun way with other opponents
            </p>

            <div className='dash-btns'>
              {end ? (
                <Link to='/rooms'>
                  <button className='dash-btn'>Start War</button>
                </Link>
              ) : (
                <button
                  className='dash-btn'
                  onClick={() => {
                    confirmAlert({
                      customUI: ({ onClose }) => {
                        return (
                          <div className='custom-ui'>
                            <h1>
                              To start a war you need to finish the Level Test
                            </h1>
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
                  <div className='dash-btn-flex'>
                    <span>Start War</span> 
                    <span id='lock-test' className='material-icons'>
                      lock
                    </span>
                  </div>
         
                </button>
              )}

              <Link to='/leveltest'>
                <button className='dash-btn'>Level Test</button>
              </Link>
            </div>
          </div>
        </div>

        <div className='dashboard-right'>
          <img src={ma} alt='' />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
