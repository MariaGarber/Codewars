import React from 'react';
import { Link } from 'react-router-dom';

import './SectionB.css';
import pic1 from '../../../../assets/pic1-b.png';
import pic2 from '../../../../assets/pic2-b.png';
import pic3 from '../../../../assets/pic3-b.png';
const SectionB = () => {
  return (
    <div className='section-b'>
      <div className='section-b-grid-layout'>
        <div className='section-b-info'>
          <h1>Accurate Insights</h1>
          <p>
            The most important thing in the code world is having reliable
            insights about your capabilities. Codewars generates automatically
            scored reports about <br /> your's coding abilities, empowering you
            to gauge technical skills and improve them as needed.
          </p>
        </div>

        <div className='section-b-pic'>
          <img src={pic1} alt='' />
        </div>
      </div>

      <div className='section-b-grid-layout'>
        <div className='section-b-pic'>
          <img src={pic2} alt='' width='180px' />
        </div>

        <div className='section-b-info'>
          <h1>Educational Benefits</h1>
          <p>
            Educational games are games in which the material taught is
            transmitted in the form of a game. Educational games have become
            popular in recent years following studies that have shown an upward
            trend in motivation, concentration, and enjoyment after the learning
            material has been delivered in this form of play.
          </p>
        </div>
      </div>

      <div className='section-b-grid-layout'>
        <div className='section-b-info'>
          <h1>Perform Your Best</h1>
          <p>
            We’ve designed our interface to be simple and intuitive, based on
            key issues the users often experience and we offer free coding
            challenges to help you improve your skills, challenge yourself and
            earn rewards.
          </p>
        </div>
        <div className='section-b-pic'>
          <img src={pic3} alt='' width='430px' />
        </div>
      </div>
    </div>
  );
};

export default SectionB;
