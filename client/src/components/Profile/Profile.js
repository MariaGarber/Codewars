import React, { useState, useEffect } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import './Profile.css';
import LoggedInNav from '../NavBar/LoggedInNav/LoggedInNav';
import Tabs from './Tabs/Tabs';
import ReactCountryFlag from 'react-country-flag';
import { getCountryName } from '../../countries';
import axios from 'axios';
import queryString from 'query-string';
import { getCookie } from '../../cookies';
import socket from '../../socket';

const Profile = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [tier, setTier] = useState('');
  const [profileImg, setProfileImg] = useState('male');
  const [self, setSelf] = useState(false);
  const [friendStatus, setFriendStatus] = useState('not friends');

  useEffect(() => {
    const { id } = queryString.parse(window.location.search);
    setUserId(id);
    setSelf(id === getCookie('id'));
    axios({
      method: 'get',
      url: 'https://codewars-project.herokuapp.com/getprofiledata',
      params: {
        cookie: id,
      },
    })
      .then((response) => {
        let friendsArr = response.data.friends;
        let idp = getCookie('id');
        setName(response.data.firstName + ' ' + response.data.lastName);
        setCountry(response.data.country);
        setEmail(response.data.email);
        setBirthday(response.data.birthday);
        setGender(response.data.gender);
        setMemberSince(response.data.memberSince);
        setLastSeen(response.data.lastSeen);
        setProfileImg(response.data.profileImg);
        switch (response.data.tier) {
          case 'easy':
            setTier('Beginner');
            break;
          case 'medium':
            setTier('Intermediate');
            break;
          case 'hard':
            setTier('Expert ');
            break;
          default:
            setTier('Level Test Required');
        }
        for (let i = 0; i < friendsArr.length; i++) {
          if (friendsArr[i].id === idp) setFriendStatus(friendsArr[i].status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className='profile'>
      <LoggedInNav />
      <div className='profile-background'></div>
      <div className='profile-container'>
        <div className='profile-up'>
          <div className='profile-imge'>
            <img
              src={require(`../../assets/avatars/${profileImg}.jpg`)}
              alt=''
            />
            <div className='profile-name-and-flag'>
              <h1>{name}</h1>
              <div id='profile-flag'>
                <ReactCountryFlag
                  countryCode={getCountryName(country)}
                  svg
                  style={{
                    width: '30px',
                    height: '20px',
                  }}
                />
                <p>{country}</p>
              </div>
            </div>
            <div>
              {!self && friendStatus === 'friends' ? (
                <button
                  className='friends-btn'
                  onClick={() => {
                    confirmAlert({
                      title: 'delete friend',
                      message:
                        'Do you sure you want to delete ' +
                        name +
                        ' from your friends?',
                      buttons: [
                        {
                          label: 'Yes',
                          onClick: () => {
                            axios
                              .post(
                                'https://codewars-project.herokuapp.com/deletefriend',
                                {
                                  id: getCookie('id'),
                                  friendId: userId,
                                }
                              )
                              .then((response) => {
                                setFriendStatus('not friends');
                              })
                              .catch((error) => {
                                console.log(error);
                              });
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
                  }}
                >
                  delete friend
                  <span class='material-icons profile-add-friend-icon'>
                    person_add_disabled
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          <div className='profile-up-box'></div>
          <div className='profile-up-box'>
            <label>Email:</label>
            <p>{email}</p>
            <label>Birth Date:</label>
            <p>{birthday}</p>
            <label>Gender:</label>
            <p>{gender}</p>
          </div>
          <div className='profile-up-box'>
            <label>Member Since:</label>
            <p>{memberSince}</p>
            <label>Last Seen:</label>
            <p>{lastSeen}</p>
            <label>Tier:</label>
            <p>{tier}</p>
          </div>
        </div>
        {!self && friendStatus !== 'friends' ? (
          <div className='profile-middle'>
            {friendStatus === 'waiting' ? (
              <div className='profile-middle-flex'>
                <div className='profile-middle-flex-inner'>
                  <h2>{'Your request was sent'}</h2>
                  <p>{`wait for ${name} to respond your request...`}</p>
                </div>
                <button
                  className='mr-right-btn'
                  onClick={() => {
                    axios
                      .post(
                        'https://codewars-project.herokuapp.com/declinefriend',
                        {
                          id: getCookie('id'),
                          friendId: userId,
                        }
                      )
                      .then(() => {
                        socket.emit('getMyAlerts', getCookie('id'));
                        setFriendStatus('not friends');
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                >
                  cancel request{' '}
                  <span class='material-icons profile-add-friend-icon'>
                    person_add_disabled
                  </span>
                </button>
              </div>
            ) : friendStatus === 'not friends' ? (
              <div className='profile-middle-flex'>
                <div className='profile-middle-flex-inner'>
                  <h2>{'Do you know ' + name + '?'}</h2>
                  <p>{`To be keeping track of ${name} progress, send friend request. `}</p>
                </div>

                <button
                  className='mr-right-btn'
                  onClick={() => {
                    socket.emit('addFriend', {
                      myId: getCookie('id'),
                      friendId: userId,
                    });
                    setFriendStatus('waiting');
                  }}
                >
                  add to friends{' '}
                  <span class='material-icons profile-add-friend-icon'>
                    person_add
                  </span>
                </button>
              </div>
            ) : friendStatus === 'sent' ? (
              <div className='profile-middle-flex'>
                <div className='profile-middle-flex-inner'>
                  <h2>{name + ' sent you friend request'}</h2>
                  <p>{`For better tracking of ${name} progress, accept the request.`}</p>
                </div>
                <div className='profile-middle-accept-deny-btns'>
                  <button
                    onClick={() => {
                      socket.emit('acceptFriend', {
                        id: getCookie('id'),
                        friendId: userId,
                      });
                      setFriendStatus('friends');
                    }}
                  >
                    accept
                  </button>
                  <button
                    id='profile-middle-deny-color'
                    onClick={() => {
                      axios
                        .post(
                          'https://codewars-project.herokuapp.com/declinefriend',
                          {
                            id: getCookie('id'),
                            friendId: userId,
                          }
                        )
                        .then(() => {
                          socket.emit('getMyAlerts', getCookie('id'));
                          setFriendStatus('not friends');
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
            ) : null}
          </div>
        ) : null}

        <div className='profile-down'>
          <div className='tabs'>
            <Tabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
