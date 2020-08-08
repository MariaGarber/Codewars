import React from 'react';
import './Pagination.css'

const Pagination = ({ friendsPerPage, totalFriends, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalFriends / friendsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='pagination'>
        {pageNumbers.map(number => (
          <span onClick={() => paginate(number)} className='pagination-item' key={number} >
            <a href='#friendslist'>
              {number}
            </a>
          </span>
        ))}
    </div>
  );
};

export default Pagination;