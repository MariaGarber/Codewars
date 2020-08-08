import React from 'react';
import './ResultRow.css';
import ReactCountryFlag from 'react-country-flag';
import { getCountryName } from '../../../countries';
import { getCookie } from '../../../cookies';
import socket from '../../../socket';

const ResultRow = ({ users, friends, updateFriendship }) => {
  const myId = getCookie('id');

  const checkFriend = (id) => {
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].id === id) return friends[i].status;
    }
    return 'not friends';
  };

  const checkSelf = (id) => {
    if (id === myId) return true;
    return false;
  };

  return (
    <React.Fragment>
      {users.map((user) => {
        let status = checkFriend(user.id);
        return (
          <tr>
            <td className='shorter-td'>
              <div className='search-img-name'>
                <a href={'/profile?id=' + user.id}>
                  <img
                    src={require(`../../../assets/avatars/${user.img}.jpg`)}
                    alt=''
                  />
                </a>
                <div className='search-img-name-info'>
                  <p>
                    <b>{user.name}</b>
                  </p>
                  <p>
                    {/* Level: {user.level} |  */}
                    Programing Level:
                    {user.programingLevel === 'easy' ? (
                      <span className='friend-beginner'>{' Beginner'}</span>
                    ) : user.programingLevel === 'medium' ? (
                      <span className='friend-intermediate'>
                        {' Intermediate'}
                      </span>
                    ) : user.programingLevel === 'hard' ? (
                      <span className='friend-intermediate'>{' Expert'}</span>
                    ) : (
                      <span>{' None'}</span>
                    )}
                  </p>
                  <p>Last Seen: {user.lastSeen} </p>
                </div>
              </div>
            </td>

            <td className='search-member-since'>
              <p>{user.memberSince}</p>
            </td>

            <td>
              <div className='search-flag'>
                <ReactCountryFlag
                  countryCode={getCountryName(user.country)}
                  svg
                  style={{
                    marginRight: '5px',
                    width: '30px',
                    height: '20px',
                  }}
                />
                <p>{user.country}</p>
              </div>
            </td>
            <td className='serach-add-user'>
              {status === 'friends' ? (
                'Friends'
              ) : status === 'sent' ? (
                'Friend request sent'
              ) : status === 'waiting' ? (
                'Waiting for your apply'
              ) : checkSelf(user.id) ? null : (
                <span
                  class='material-icons serach-add-user-icon'
                  onClick={() => {
                    socket.emit('addFriend', { myId, friendId: user.id });
                    updateFriendship(user.id);
                  }}
                >
                  add
                </span>
              )}
            </td>
          </tr>
        );
      })}
    </React.Fragment>
  );
};

export default ResultRow;
