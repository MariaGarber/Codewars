import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { getCookie } from '../../../../cookies';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import axios from 'axios';

const Friends = ({ friends,updateFriendship }) => {
  const [self, setSelf] = useState(false);

  useEffect(() => {
    const { id } = queryString.parse(window.location.search);
    setSelf(id === getCookie('id'));
  }, []);


  return (
    <React.Fragment>
      {friends.map((friend) => (
        <tr>
          <td>
            <div className='friend'>
              <a href={'/profile?id=' + friend.id}>
                <img
                  src={require(`../../../../assets/avatars/${friend.img}.jpg`)}
                  alt=''
                />
              </a>
              <div className='friend-info'>
                <label>{friend.name}</label>
                <div>
                  Level: {friend.level} | Programing Level:
                  {friend.programingLevel === 'Beginner' ? (
                    <span className='friend-beginner'>
                      {' '}
                      {friend.programingLevel}
                    </span>
                  ) : friend.programingLevel === 'Intermediate' ? (
                    <span className='friend-intermediate'>
                      {' '}
                      {friend.programingLevel}
                    </span>
                  ) : (
                    <span className='friend-expert'>
                      {' '}
                      {friend.programingLevel}
                    </span>
                  )}
                </div>
                <div>Last Seen: {friend.lastSeen}</div>
              </div>
              {self ? (
                <div className='delete-friend'>
                  <span
                    class='material-icons delete-friend-icon'
                    onClick={() => {
                      confirmAlert({
                        title: 'delete friend',
                        message:
                          'Do you sure you want to delete ' +
                          friend.name +
                          ' from your friends?',
                        buttons: [
                          {
                            label: 'Yes',
                            onClick: () => {
                              axios
                                .post('https://codewars-project.herokuapp.com/deletefriend', {
                                  id: getCookie('id'),
                                  friendId: friend.id,
                                })
                                .then((response) => {
                                  updateFriendship(friend.id);
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
                    delete
                  </span>
                </div>
              ) : null}
            </div>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
};

export default Friends;
