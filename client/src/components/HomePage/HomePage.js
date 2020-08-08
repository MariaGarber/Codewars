import React from 'react';
import NavBar from '../NavBar/NavBar';
import SectionA from './Sections/SectionA/SectionA';
import SectionB from './Sections/SectionB/SectionB';
import SectionC from './Sections/SectionC/SectionC';
import Footer from './Sections/Footer/HomeFooter/HomeFooter';

import './HomePage.css';

const HomePage = () => {
  return (
    <div className='home-page'>
      <NavBar />
      <SectionA />
      <SectionB />
      <SectionC/>
      <Footer/>
    </div>
  );
};

export default HomePage;
