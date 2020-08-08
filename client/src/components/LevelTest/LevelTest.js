import React, { useState, useEffect } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import './LevelTest.css';
import { Link } from 'react-router-dom';
import medal from '../../assets/medal.png';
import LoggedInNav from '../NavBar/LoggedInNav/LoggedInNav';
import { setCookie, getCookie } from '../../cookies';
import axios from 'axios';

const LevelTest = () => {
  const [typeOfRoom, setTypeOfRoomTest] = useState('python');
  const [firstTest, setFirstTest] = useState({
    test_name: '',
    score: '',
    time: ''
  });

  const [secondTest, setSecondTest] = useState({
    test_name: '',
    score: '',
    time: ''
  });

  const [thirdTest, setThirdTest] = useState({
    test_name: '',
    score: '',
    time: ''
  });

  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [finishLevelTest, setFinishLevelTest] = useState(false);
  useEffect(() => {
    let id = {};
    id.cookie = getCookie('id');
    axios
      .post('https://codewars-project.herokuapp.com/userTests', id)
      .then(response => {
        console.log(response.data.data);
        if (response.data.data[0]) {
          setFirstTest(response.data.data[0]);
          setAvg(response.data.data[0].score);
          setCount(1);
        }
        if (response.data.data[1]) {
          setSecondTest(response.data.data[1]);
          setAvg(response.data.data[0].score + response.data.data[1].score);
          setCount(2);
        }
        if (response.data.data[2]) {
          setFinishLevelTest(true);
          setThirdTest(response.data.data[2]);
          setAvg(
            response.data.data[0].score +
              response.data.data[1].score +
              response.data.data[2].score
          );
          setCount(3);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const finished = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>You already finished the Level Test</h1>
            <button onClick={() => onClose()} className='room-btn-alert'>
              Ok
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div className='full-height'>
      <LoggedInNav />
      <div className='level-test'>
        <div className='level-test-left-side'>
          <div className="center-of-div">
          <h1 className='level-test-header'>
            Level Test!
            <span className='material-icons test-assignment'>assignment</span>
          </h1>
          <div className='level-test-header-line'></div>
          <p>
            In order to provide you with the best gaming 
            experience, you must pass the level test.
          </p>
          <p>
            The level test will define your programming 
            level and then you can start
            to compete with other players with same 
            programming level as yours.
          </p>
     
          <p>
            In total, you have to answer on 3 
            challenges and after that your
            programming level will be defined.
          </p>
          <h2>How it is going to be:</h2>
          <p>
            After you press the Start Test button the system will generate
            a random challenge for you and you will have 120 minutes
            to solve the challenge and submit the code.
          </p>
          <h2>Result page:</h2>
          <p>
            After you submit your code the system will check it and you will be 
            transferred to the result page, there you will see your score and
            the tests done by the system to check your submitted code.
          </p>
          <label className='lb-choose'>Choose programing language </label>
          <select
              id='select-lang'
              onChange={(e) => setTypeOfRoomTest(e.target.value)}
            >
              <option value='python'>Python</option>
            </select>
          {finishLevelTest ? (
            <button onClick={finished} className='start-test-btn'>
              Start Test
            </button>
          ) : (
            <Link
              to='/roomtest'
              onClick={() => {
                setCookie('test', true);
              }}
            >
              <button className='start-test-btn'>Start Test</button>
            </Link>
          )}
          </div>

        </div>

        <div className='level-test-vertical-line'></div>

        <div className='level-test-right-side'>
          <h1>
            Your score now:{' '}
            <span className='score-color'>
              {avg !== 0 ? parseInt(avg / count) : avg}%
            </span>{' '}
          </h1>
          <div className='first-question box'>
            <h2>First Challenge</h2>
            <div className='box-container'>
              <i className='material-icons'>ballot</i>
              <p>
                <b>Challenge name: </b>
                {firstTest.test_name}{' '}
              </p>
              <i className='material-icons'>assessment</i>
              <p>
                <b>Score: </b>
                {firstTest.score !== ''
                  ? firstTest.score + '%'
                  : firstTest.score}
              </p>
              <i className='material-icons'>timelapse</i>
              <p>
                <b>Time: </b>
                {firstTest.time}
              </p>
            </div>
          </div>

          <div className='second-question box'>
            <h2>Second Challenge</h2>
            <div className='box-container'>
              <i className='material-icons'>ballot</i>
              <p>
                <b>Challenge name: </b>
                {secondTest.test_name}
              </p>
              <i className='material-icons'>assessment</i>
              <p>
                <b>Score: </b>
                {secondTest.score !== ''
                  ? secondTest.score + '%'
                  : secondTest.score}
              </p>
              <i className='material-icons'>timelapse</i>
              <p>
                <b>Time: </b>
                {secondTest.time}
              </p>
            </div>
          </div>

          <div className='third-question box'>
            <h2>Third Challenge</h2>
            <div className='box-container'>
              <i className='material-icons'>ballot</i>
              <p>
                <b>Challenge name: </b>
                {thirdTest.test_name}
              </p>
              <i className='material-icons'>assessment</i>
              <p>
                <b>Score: </b>
                {thirdTest.score !== ''
                  ? thirdTest.score + '%'
                  : thirdTest.score}
              </p>
              <i className='material-icons'>timelapse</i>
              <p>
                <b>Time: </b>
                {thirdTest.time}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelTest;
