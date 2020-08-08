import React, { useState, useEffect } from 'react';
import LoggedInNav from '../NavBar/LoggedInNav/LoggedInNav';
import { checkCookie } from '../../cookies';
import NavBar from '../NavBar/NavBar';
import './FaqPage.css';
import Faq from 'react-faq-component';
import MyPDF from './manual.pdf';

const About = () => {
  const [exist, setExist] = useState(false);
  const [divName, setDivName] = useState('faq-notloggedin');

  useEffect(() => {
    if (checkCookie('id')) {
      setExist(true);
      setDivName('faq-loggedin');
    } else {
      setExist(false);
      setDivName('faq-notloggedin');
    }
  }, []);

  const data = {
    title: 'FAQ',
    rows: [
      {
        title: 'Who can play the game?',
        content: `Codewars is open for everyone and everyone 
        can play it, however the user must have a 
        basic programming level.`,
      },
      {
        title: 'How does it all work?',
        content:
          'For User Manual press ' +
          '<a href=' +
          MyPDF +
          ' download=' +
          'User_Manual.pdf' +
          '> here </a>',

        // '<a href="../../assets/manual.pdf" target="_blank" download>Download</a>',
      },
      {
        title: 'What sort of code will I write during the war?',
        content: `Each challenge require you to write short programs (usually 10–20 lines). 
              Tasks differ in difficulty and scope.`,
      },
      {
        title: 'How will my solutions be assessed?',
        content: `After you finish the test, we will run your solutions against
              multiple test cases to verify their correctness (e.g. whether your code handles corner cases)
              and scalability (whether your code remains practical as the data size grows). 
              Afterwards the results will be presented to you.`,
      },
      {
        title: 'Do I need to install any software?',
        content: `You only need a supported browser. You don’t need to install any applications or browser plug-ins. 
              The Codewars interface contains a coding environment that provides everything you need to solve the tasks 
              (you can edit, compile and run your solutions many times before you submit your code).`,
      },
      {
        title: 'Can I use my own IDE?',
        content: `Yes, you can write your solution in an editor of your choice and paste the solution back into the Codewars interface. 
                  Use the ‘Run’ button to make sure that the code has been copied properly and that Codewars is able to compile 
                  and execute it. Your compiler is not necessarily the same as ours, so remember to write portable, 
                  standards-compliant code.`,
      },
      {
        title: 'Will I lose points for syntax errors?',
        content: `If your final submission doesn’t compile, we won’t be able to assess your code and you will not 
                get any points. Be sure to use the ‘Run’ button to check for compilation errors while working on the solution.`,
      },
      // {
      //   title: 'Tutorial',
      //   content: 'v1.0.0 ' + '<a href="/tutorial">click here</a>'
      // }
    ],
  };

  const styles = {
    bgColor: 'white',
    titleTextColor: '#1EBEA5',
    rowTitleColor: '#197DA5',
    rowContentColor: 'black',
  };

  return (
    <div>
      {exist ? <LoggedInNav /> : <NavBar />}
      <div className={divName}>
        <div className='faq-container'>
          <h2>About</h2>
          <div className='faq-sep'></div>
          <p>
            <b>Codewars</b> it’s a learning environment that allows users to
            face each other in code competitions whose purpose is to offer
            programmers at all levels a tool to improve and test their knowledge
            against other people in the world. The players can test their
            knowledge and skills in programming, look at their enemies profiles
            and see their knowledge, skills and capabilities.
          </p>
          <p>
            The website is free andall system information is maintained in a
            secure database, which is located on a web-server. In addition, the
            correctness of the code that entered by the user is checked by code
            assessment tool.
          </p>
          <p>
            <b>Codewars</b> tool was build by 2 students from Sami Shamoon
            College as part of their final project.
          </p>
          <div className='faq-component'>
            <Faq data={data} styles={styles} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

// '<a href="/tutorial">click here</a>'
