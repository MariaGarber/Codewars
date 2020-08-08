import React, { useState, useEffect } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './RoomNav.css';
import { getCookie, deleteCookie } from '../../../cookies';
import socket from '../../../socket';
import { confirmAlert } from 'react-confirm-alert';

const RoomNav = (props) => {
  const [navName, setNavName] = useState('Admin');
  const [userLevel, setUserLevel] = useState('0');
  const [userExp, setUserExp] = useState('0');

  useEffect(() => {
    setNavName(getCookie('name'));
    setUserLevel(getCookie('level'));
    setUserExp(getCookie('exp') / (parseInt(getCookie('level')) + 1));
  }, []);

  const exitCheck = () => {
    let str = window.location.href;
    if (str.search('nameOfRoom=room') !== -1) {
      exit(str, 'room', 'nameOfRoom=room', `/rooms`, 'Leave The Game');
    } else if (str.search('roomtest') !== -1) {
      exit(str, 'test', 'roomtest', `/leveltest`, 'Leave The Test');
    }
  };

  const exit = (str, cname, pcheck, path, msg) => {
    if (getCookie(cname) === '') str = '';
    if (str.search(pcheck) !== -1) {
      confirmAlert({
        title: msg,
        message: 'Do you sure you want to leave?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              socket.disconnect();
              deleteCookie(cname);
              props.history.replace(path);
              window.location.reload();
            },
          },
          {
            label: 'No',
            onClick: () => {},
          },
        ],
        closeOnEscape: false,
        closeOnClickOutside: false,
      });
    } else {
      props.history.replace(path);
      window.location.reload();
    }
  };

  return (
    <nav className='loggedIn-nav'>
      <div className='loggedIn-nav-logo'>
        <h1>Codewars</h1>
        <p>Improve your skils</p>
      </div>

      <div className='name-and-level'>
        <div className='navName'>
          <label>Good Luck, {navName}!</label>
        </div>

        <div className='user-level'>
          <label>Level: {userLevel}</label>
          <br />
          <label className='exp'>Exp:</label>
          <br />
          <progress max='100' value={userExp}></progress>
        </div>

        <div>
          <button className='exit-btn' onClick={exitCheck}>
            Exit
          </button>
        </div>
      </div>
    </nav>
  );
};

export default RoomNav;
