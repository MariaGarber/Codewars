import React from 'react';
import { Link } from 'react-router-dom';

import './SectionA.css';

const SectionA = () => {
  return (
    <div className='section-a'>
      <div className='section-a-container'>
        <h1>Explore your</h1>
        <h1 id='section-a-h1'>programing level</h1>
        <p>
          Codewars is the best platform to help you enhance your skills, <br />
          expand your knowledge and just have fun!
        </p>
        <Link to='/login'>
          <button id='section-a-btn'>Get started!</button>
        </Link>
      </div>

      <div className='section-a-pic'></div>
    </div>
  );
};

export default SectionA;
