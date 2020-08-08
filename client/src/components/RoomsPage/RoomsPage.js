import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../../cookies';
import socket from '../../socket';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import './RoomsPage.css';
import UpdatedRooms from '../UpdatedRooms/UpdatedRooms.js';
import ReactCountryFlag from 'react-country-flag';
import { getCountryName } from '../../countries';
import LoggedInNav from '../NavBar/LoggedInNav/LoggedInNav';

const RoomsPage = (props) => {
  const [typeOfRoom, setTypeOfRoom] = useState('python');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [backUpAvailableRooms, setBackUpAvailableRooms] = useState([]);
  const [country, setCountry] = useState('Israel');
  const [levelFilter, setLevelFilter] = useState('none');
  const [languageFilter, setLanguageFilter] = useState('none');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [backUpOnlineUsers, setBackUpOnlineUsers] = useState([]);

  useEffect(() => {
    console.log('rooms page rendered');
    socket.emit('update');
    socket.emit('userOnline', { id: getCookie('id') });
  }, [window.location.search]);

  useEffect(() => {
    window.onbeforeunload = () => {
      socket.emit('userOffline', { id: getCookie('id') });
    };
  }, [window.onbeforeunload]);

  useEffect(() => {
    window.onpopstate = () => {
      socket.emit('userOffline', { id: getCookie('id') });
    };
  }, [window.onpopstate]);

  useEffect(() => {
    socket.on('roomName', (name) => {
      socket.emit('update');
      setCookie('room', name);
      props.history.push(`/room?nameOfRoom=${name}`);
    });

    socket.on('updatedRooms', (r) => {
      setBackUpAvailableRooms(r);
      if (levelFilter === 'none' && languageFilter === 'none')
        setAvailableRooms(r);
      else filterRooms(r);
    });

    socket.on('joined', (name) => {
      setCookie('room', name);
      props.history.push(`/room?nameOfRoom=${name}`);
      socket.emit('update');
    });

    socket.on('alreadyExist', () => {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='custom-ui'>
              <h1>You already have a room!</h1>
              <button onClick={() => onClose()} className='room-btn-alert'>
                Ok
              </button>
            </div>
          );
        },
      });
    });

    socket.on('levelNotMatch', () => {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='custom-ui'>
              <h1>Sorry your tier does not match the room tier...</h1>
              <button onClick={() => onClose()} className='room-btn-alert'>
                Ok
              </button>
            </div>
          );
        },
      });
    });

    socket.on('onlineUsersUpdate', (users) => {
      setOnlineUsers(users);
      setBackUpOnlineUsers(users);
    });
  }, [window.location.search]);

  const createRoom = () => {
    console.log('create room btn clicked');
    socket.emit('newRoom', getCookie('id'));
  };

  useEffect(() => {
    filterRooms(backUpAvailableRooms);
  }, [levelFilter, languageFilter]);

  const filterRooms = (rooms) => {
    let tmp = [];
    if (levelFilter !== 'none' && languageFilter !== 'none') {
      for (let i = 0; i < rooms.length; i++)
        if (
          rooms[i].tier === levelFilter &&
          rooms[i].planguage === languageFilter
        )
          tmp.push(rooms[i]);

      setAvailableRooms(tmp);
    } else if (levelFilter !== 'none' && languageFilter === 'none') {
      for (let i = 0; i < rooms.length; i++)
        if (rooms[i].tier === levelFilter) tmp.push(rooms[i]);

      setAvailableRooms(tmp);
    } else if (levelFilter === 'none' && languageFilter !== 'none') {
      for (let i = 0; i < rooms.length; i++)
        if (rooms[i].planguage === languageFilter) tmp.push(rooms[i]);

      setAvailableRooms(tmp);
    } else {
      setAvailableRooms(backUpAvailableRooms);
    }
  };

  const findUser = (name) => {
    if (name === '') {
      setOnlineUsers(backUpOnlineUsers);
    } else {
      let matches = onlineUsers.filter((user) => {
        const regex = new RegExp(`^${name}`, 'gi');
        return (
          user.name.match(regex) ||
          user.name.includes(name) ||
          user.name.toLowerCase().includes(name)
        );
      });
      setOnlineUsers(matches);
    }
  };

  return (
    <div className='rooms-page-container'>
      <LoggedInNav />

      <div className='rooms-page-grid-container'>
        <div className='live-users'>
          <h1>Live Users</h1>
          <div className='live-users-search'>
            <input
              type='text'
              placeholder='Find user...'
              onChange={(e) => {
                findUser(e.target.value);
              }}
            />
          </div>
          <div className='live-users-container'>
            <ul>
              {onlineUsers.map((user) => {
                return (
                  <li>
                    <a href={'/profile?id=' + user.id}>
                      <label className='users-name-live'>{user.name}</label>
                    </a>
                    <div className='users-flag-live'>
                      <ReactCountryFlag
                        countryCode={getCountryName(user.country)}
                        svg
                        style={{
                          width: '30px',
                          height: '20px'
                        }}
                      />
                      <p className='users-country-live'>{getCountryName(user.country)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className='rooms-page-grid-container-middle'>
          <div className='rooms-page-grid-container-middle-inner'>
            <h1>Welcome To The War </h1>
            <div className='rooms-line'></div>
            <p>
              The rules are very simple, after you have successfully passed the
              level test you can play with other players at your programming
              level. The more you play, you will raise levels in the game and
              your programming level will increase which will allow you to play
              at the harder levels.
            </p>
            <h2>How to start?</h2>
            <p>
              You can choose whether to open a new room or join an existing room
              where your where your opponent at the same programming level as
              you is waiting. If you choose to open a new room, you will also
              need to choose the programming language you want to compete with.
            </p>

            <div className='demo'>
              <h2>Rooms Level:</h2>
              <button className='btns-demo btn-demo-green'>Easy</button>
              <button className='btns-demo btn-demo-orange'>Medium</button>
              <button className='btns-demo btn-demo-red'>Hard</button>
            </div>

            <button className='btn-create-room' onClick={createRoom}>
              Create Room
            </button>
            <select
              id='select-lang'
              onChange={(e) => setTypeOfRoom(e.target.value)}
            >
              <option value='python'>Python</option>
            </select>
          </div>
        </div>
        {/* <div className='rooms-page-grid-container-right-line'></div> */}
        <div className='rooms-page-grid-container-right'>
          <div className='rooms-page-grid-container-right-inner'>
            <div className="h1-and-underscore">
              <h1>Rooms List:</h1>
              <div className='rooms-list-line'></div>
            </div>
         
            <div className='rooms-page-filter'>
              <div>
                <label>Level:</label>
                <select onChange={(e) => setLevelFilter(e.target.value)}>
                  <option value='none'>None</option>
                  <option value='easy'>Easy</option>
                  <option value='medium'>Medium</option>
                  <option value='hard'>Hard</option>
                </select>
              </div>
              <div>
                <label>Language:</label>
                <select
                  onChange={(e) => {
                    setLanguageFilter(e.target.value);
                  }}
                >
                  <option value='none'>None</option>
                  <option value='python'>Python</option>
                </select>
              </div>
            </div>
            <div id='roomsList'>
              <UpdatedRooms rooms={availableRooms} type={typeOfRoom} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
