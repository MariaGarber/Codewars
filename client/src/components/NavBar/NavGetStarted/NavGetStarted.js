import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavGetStarted.css';
import { getCookie, deleteCookie } from '../../../cookies';
import admin from '../../../assets/admin.png';
// import axios from 'axios';

const NavGetStarted = () => {
  const [navName, setNavName] = useState('Admin');
  const [userLevel, setUserLevel] = useState('0');
  const [userExp, setUserExp] = useState('80');

  useEffect(() => {
    setNavName(getCookie('name'));
  }, [window.location.search]);

  function myFunction() {
    document
      .getElementById('myDropdown')
      .classList.toggle('nav-bar-get-started-show');
  }

  // Close the dropdown if the user clicks outside of it
  window.onclick = function(e) {
    if (!e.target.matches('.drop-img')) {
      var myDropdown = document.getElementById('myDropdown');
      if (myDropdown) {
        if (myDropdown.classList.contains('nav-bar-get-started-show')) {
          myDropdown.classList.remove('nav-bar-get-started-show');
        }
      }
    }
  };

  const logOut = () => {
    deleteCookie('id');
    deleteCookie('name');
  };

  return (
    <nav className='nav-bar-get-started'>
      <h1 id='nav-bar-get-started-logo'>Code Wars</h1>

      <p>Improve your skils</p>
      <ul>
        <li>
          <Link className='nav-bar-get-started-links' to='/'>
            Home Page
          </Link>
        </li>

        <li>
          <Link
            className='nav-bar-get-started-links space-to-right'
            to='/rooms'
          >
            Rooms
          </Link>
        </li>

        <div className='name-and-img'>
          <div className='navName'>
            <label>Hello, {navName}!</label>
          </div>

          <div className='nav-bar-get-started-dropdown'>
            <img
              src={admin}
              alt=''
              className='drop-img'
              onMouseOver={myFunction}
            />
            <i className='material-icons'>arrow_drop_down</i>
            <div
              className='nav-bar-get-started-dropdown-content'
              id='myDropdown'
            >
              <i className='material-icons drop-down-user-icon'>
                account_circle
              </i>
              <Link
                className='nav-bar-get-started-links nav-bar-get-started-drop-down-links'
                to='/profile'
              >
                View Profile{' '}
              </Link>
              <i className='material-icons drop-down-user-icon'>create</i>
              <Link
                className='nav-bar-get-started-links nav-bar-get-started-drop-down-links'
                to='/profile/update'
              >
                Update Profile
              </Link>
              <div className='line-in-drop-down'> </div>
              <i className='material-icons drop-down-user-icon red-drop-down'>
                power_settings_new
              </i>
              <Link
                className='nav-bar-get-started-links nav-bar-get-started-drop-down-links red-drop-down'
                to='/'
                onClick={logOut}
              >
                Log Out
              </Link>
            </div>
          </div>

          <div className='user-level'>
            {/* <label >Hello {navName}!</label>
                        <br/> */}
            <label>Level: {userLevel}</label>
            <br />
            <label className='exp'>Exp:</label>
            <br />
            <progress max='100' value={userExp}></progress>
          </div>
        </div>
      </ul>
    </nav>
  );
};

export default NavGetStarted;

// let id = {};
// id.cookie = getCookie('id');
// axios
//   .post('http://localhost:4000/name', id)
//   .then(response => {
//     setNavName(response.data.name);
//   })
//   .catch(error => {
//     console.log(error);
//   });
