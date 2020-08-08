import React, { useState, useEffect } from 'react';
import './LoggedInNav.css';
import { getCookie, deleteCookie } from '../../../cookies';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import socket from '../../../socket';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 55,
    right: 0,
    left: -50,
    zIndex: 1,
    border: '1px solid grey',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    width: 380,
  },
}));

const LoggedInNav = () => {
  const [navName, setNavName] = useState('Admin');
  const [userLevel, setUserLevel] = useState('0');
  const [userExp, setUserExp] = useState('0');
  const [profileImg, setProfileImg] = useState('male');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [alertNumber, setAlertNumber] = useState(0);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setNavName(getCookie('name'));
    setUserLevel(getCookie('level'));
    setUserExp(getCookie('exp') / (parseInt(getCookie('level')) + 1));
    setProfileImg(getCookie('profilePic'));
    axios({
      method: 'get',
      url: 'https://codewars-project.herokuapp.com/getalerts',
      params: {
        id: getCookie('id'),
      },
    })
      .then((response) => {
        setAlerts(response.data.alerts);
        setAlertNumber(numberOfNewAlerts(response.data.alerts));
      })
      .catch((error) => {
        console.log(error);
      });
    socket.on('newAlert', (id) => {
      if (getCookie('id') === id) socket.emit('getMyAlerts', id);
    });

    socket.on('userAlerts', (alerts) => {
      setAlerts(alerts);
      setAlertNumber(numberOfNewAlerts(alerts));
    });
  }, [window.location.search]);

  function myFunction() {
    document.getElementById('myDropdown').classList.toggle('loggedIn-nav-show');
  }

  // Close the dropdown if the user clicks outside of it
  window.onclick = function (e) {
    if (!e.target.matches('.loggedIn-nav-drop-img')) {
      var myDropdown = document.getElementById('myDropdown');
      if (myDropdown) {
        if (myDropdown.classList.contains('loggedIn-nav-show')) {
          myDropdown.classList.remove('loggedIn-nav-show');
        }
      }
    }
  };

  const logOut = () => {
    deleteCookie('id');
    deleteCookie('name');
  };

  const handleClick = () => {
    setOpen((prev) => !prev);
    setAlertNumber(0);
    axios({
      method: 'get',
      url: 'https://codewars-project.herokuapp.com/setalertstatus',
      params: {
        id: getCookie('id'),
      },
    })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const searchByPress = (e) =>{
    if(e.key === 'Enter'){
      document.location.href = '/searchresults?search=' + search
    }
  }

  const handleClickAway = () => {
    setOpen(false);
  };

  const numberOfNewAlerts = (arr) => {
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].status === 'new') counter = counter + 1;
    }
    return counter;
  };

  const checkOnline = () => {
    console.log('loc');
    let str = window.location.href;
    if (str.search('rooms') !== -1) {
      socket.emit('userOffline', { id: getCookie('id') });
    }
  };

  return (
    <nav className='loggedIn-nav'>
      <div className='loggedIn-nav-logo'>
        <a href='/'>
          <h1> Codewars</h1>
        </a>
        <p>Improve your skils</p>
      </div>

      <ul className='loggedIn-nav-links'>
        <li>
          <a href='/'>Home</a>
        </li>
        <li>
          <a href={'/profile?id=' + getCookie('id')}>Profile</a>
        </li>
        <li>
          <a href='/faq'>FAQ</a>
        </li>
        <li>
          <a href='/contact'>Contact</a>
        </li>
      </ul>

      <div className='nav-search'>
        <div className='nav-search-container'>
          <a href={'/searchresults?search=' + search}>
            <span className='material-icons nav-search-icon'>search</span>
          </a>
          <input
            type='text'
            placeholder='Search...'
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => searchByPress(e)}
          />
        </div>
      </div>

      <div>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className={classes.root}>
            <IconButton
              color='inherit'
              onClick={handleClick}
              id='nav-notofication'
            >
              <Badge badgeContent={alertNumber} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {open ? (
              <div className={classes.dropdown}>
                {alerts.length > 0 ? (
                  alerts
                    .slice(0)
                    .reverse()
                    .map((alert) => {
                      return alert.type === 'friend-request' ? (
                        <div className='notification-container'>
                          <div className='one-row'>
                            <div className='notification-div'>
                              <a href={'/profile?id=' + alert.id}>
                                <img
                                  className='one-row-img'
                                  alt=''
                                  src={require(`../../../assets/avatars/${alert.img}.jpg`)}
                                />
                              </a>
                              <a href={'/profile?id=' + alert.id}>
                                <p className='name-in-notification'>
                                  {alert.name}
                                </p>
                              </a>
                            </div>

                            <div className='notification-div'>
                              <button
                                className='blue-btn-notification'
                                onClick={() => {
                                  socket.emit('acceptFriend', {
                                    id: getCookie('id'),
                                    friendId: alert.id,
                                  });
                                }}
                              >
                                accept
                              </button>
                              <button
                                className='red-btn-notification'
                                onClick={() => {
                                  axios
                                    .post(
                                      'https://codewars-project.herokuapp.com/declinefriend',
                                      {
                                        id: getCookie('id'),
                                        friendId: alert.id,
                                      }
                                    )

                                    .then((response) => {
                                      setAlerts(response.data.res);
                                    })
                                    .catch((error) => {
                                      console.log(error);
                                    });
                                }}
                              >
                                deny
                              </button>
                            </div>
                          </div>
                          <div className='notification-line'></div>
                        </div>
                      ) : alert.type === 'friendship-accepted' ? (
                        <div className='notification-container'>
                          <div className='friendship-accepted'>
                            <a href={'/profile?id=' + alert.id}>
                              <img
                                className='one-row-img'
                                alt=''
                                src={require(`../../../assets/avatars/${alert.img}.jpg`)}
                              />
                            </a>
                            <p className='name-in-notification'>
                              {'You and ' + alert.name + ' friends now'}
                            </p>
                          </div>
                          <div className='notification-line'></div>
                        </div>
                      ) : null;
                    })
                ) : (
                  <p className='notification-box-color'>
                    Empty notification box
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </ClickAwayListener>
      </div>

      <div className='name-and-img'>
        <div className='navName'>
          <label>Hello, {navName}!</label>
        </div>
        <div>
          <img
            src={require(`../../../assets/avatars/${profileImg}.jpg`)}
            alt=''
            className='loggedIn-nav-drop-img'
            onMouseOver={myFunction}
          />
          <div className='loggedIn-nav-dropdown-content' id='myDropdown'>
            <ul>
              <li>
                <i className='material-icons'>account_circle</i>
                <a href={'/profile?id=' + getCookie('id')}>View Profile</a>
              </li>
              <li>
                <i className='material-icons drop-down-user-icon'>create</i>
                <a href='/update'>Update Profile</a>
              </li>
              <div className='line-in-drop-down'> </div>
              <li>
                <i className='material-icons'>power_settings_new</i>
                <a
                  href='/'
                  onClick={() => {
                    checkOnline();
                    logOut();
                  }}
                >
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='user-level'>
          <label>Level: {userLevel}</label>
          <br />
          <label className='exp'>Exp:</label>
          <br />
          <progress max='100' value={userExp}></progress>
        </div>
      </div>
    </nav>
  );
};

export default LoggedInNav;
