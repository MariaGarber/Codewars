import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
const NavBar = () => {
  return (
    <nav className='nav-bar'>
      <h1>Codewars</h1>
      <ul>
        <li>
          <Link className='links' to='/'>
            Home Page
          </Link>
        </li>
        <li>
          <Link className='links' to='/faq'>
            FAQ
          </Link>
        </li>
        <li>
        
            <a  className='links' href='/#section-c'>Contact</a>
          
        
        </li>
        <li><div className='vertical-line'></div></li>
        <li id='login-li'>
          <Link id='login-link' className='links' to='/login'>
            Login
          </Link>
        </li>
        <li>
          <Link className='links' to='/register'>
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
