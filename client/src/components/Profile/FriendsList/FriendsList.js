import React, { useState, useEffect } from 'react';
import './FriendsList.css';
import Pagination from './Pagination/Pagination';
import Friends from './Friends/Friends';
import axios from 'axios';
import queryString from 'query-string';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [name, setName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [friendsPerPage] = useState(4);
  const [backUpFriends, setBackUpFriends] = useState([]);

  useEffect(() => {
    const { id } = queryString.parse(window.location.search);
    axios({
      method: 'get',
      url: 'https://codewars-project.herokuapp.com/getfriendslist',
      params: {
        cookie: id,
      },
    })
      .then((response) => {
        setFriends(response.data.friends);
        setBackUpFriends(response.data.friends);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const findFriend = (name) => {
    if (name === '') {
      setFriends(backUpFriends);
    } else {
      let matches = friends.filter((friend) => {
        const regex = new RegExp(`^${name}`, 'gi');
        return (
          friend.name.match(regex) ||
          friend.name.includes(name) ||
          friend.name.toLowerCase().includes(name)
        );
      });
      setFriends(matches);
    }
  };

  // Get current posts
  const indexOfLastPost = currentPage * friendsPerPage;
  const indexOfFirstPost = indexOfLastPost - friendsPerPage;
  const currentFriends = friends.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateFriendship = (id) => {
    let tmp = friends.filter((obj) => obj.id !== id);
    setFriends(tmp);
  };

  return (
    <div className='friendslist'>
      <h2 id='friendslist'>Friends List</h2>
      <div className='friendslist-line'></div>
      <div className='friendslist-search'>
        <input
          type='search'
          onChange={(e) => {
            findFriend(e.target.value);
            setName(e.target.value);
          }}
          placeholder='Search your friends...'
        />
        <button
          onClick={() => {
            findFriend(name);
          }}
        >
          <span class='material-icons white-color'>search</span>
        </button>
      </div>

      <div className='friendslist-container'>
        <table className='friendslist-table'>
          <Friends
            friends={currentFriends}
            updateFriendship={updateFriendship}
          />
        </table>
      </div>
      <Pagination
        friendsPerPage={friendsPerPage}
        totalFriends={friends.length}
        paginate={paginate}
      />
    </div>
  );
};

export default FriendsList;
