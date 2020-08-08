import React, { useState, useEffect } from 'react';
import './SearchResult.css';
import LoggedInNav from '../NavBar/LoggedInNav/LoggedInNav';
import ResultRow from './ResultRow/ResultRow';
import queryString from 'query-string';
import axios from 'axios';
import { getCookie } from '../../cookies';

const SearchResult = () => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const { search } = queryString.parse(window.location.search);
    setSearchValue(search);
    axios({
      method: 'get',
      url: 'https://codewars-project.herokuapp.com/searchuser',
      params: {
        id: getCookie('id'),
        search,
      },
    })
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.users);
        setFriends(response.data.friends);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateFriendship = (id) => {
    friends.push({ id, status: 'sent' });
    setFlag(!flag);
  };

  return (
    <div className='search-result'>
      <LoggedInNav />
      <div className='search-result-container'>
        <h1>
          Search Results: {users.length > 0 ? searchValue : 'User not found'}
        </h1>
        <p>(showing {users.length > 0 ? '1 - ' + users.length : 0} users)</p>
        <div className='search-result-line'></div>
        <table className='search-result-table'>
          <tr>
            <th>Name</th>
            <th className='search-result-center'>Member Since</th>
            <th className='search-result-center'>Country</th>
            <th className='search-result-center'>Add User</th>
          </tr>
          <ResultRow
            users={users}
            friends={friends}
            updateFriendship={updateFriendship}
          />
        </table>
      </div>
    </div>
  );
};

export default SearchResult;
