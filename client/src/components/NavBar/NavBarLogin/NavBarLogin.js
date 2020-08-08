import React from 'react';
import { Link } from 'react-router-dom';
import './NavBarLogin.css';
const NavBarLogin = () => {
  return (
    <nav className='nav-bar-login-register'>
      <Link id='logo-h1' className='login-register-links' to='/'>
        <h1>Codewars</h1>
      </Link>
      <p>Improve your skils</p>
      <ul>
      </ul>
    </nav>
  );
};

export default NavBarLogin;
