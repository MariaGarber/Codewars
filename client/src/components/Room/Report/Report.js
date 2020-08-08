import React, { useState, useEffect } from 'react';
import './Report.css';
import AceEditor from 'react-ace';
import ResultTable from '../../ResultTable/ResultTable';
import ReportQuestion from './ReportQuestion/ReportQuestion';
import { getCookie, setCookie } from '../../../cookies';
import axios from 'axios';
import gold from '../../../assets/gold-medal.png';
import silver from '../../../assets/silver-medal.png';
import bronze from '../../../assets/bronze-medal.png';

const Report = ({
  code,
  tableData,
  question,
  winOrLose,
  example,
  constraints,
}) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    let id = {};
    id.cookie = getCookie('id');
    axios
      .post('https://codewars-project.herokuapp.com/leveldata', id)
      .then((response) => {
        if (response.data) {
          setCookie('exp', response.data.exp, 0.25);
          setCookie('level', response.data.level, 0.25);
          setUserName(response.data.name);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className='report'>
      <div className='report-top'>
        <h1>Codewars</h1>
        <h2>Candidate Report: {userName}</h2>

        <h2>Test Score</h2>
        <p>{parseInt(tableData.g)} out of 100 points</p>
        {winOrLose ? (
          <p className='report-score-win'>
            <span>{parseInt(tableData.g) + '%'}</span>
            {tableData.g <= 70 ? (
              <img src={bronze} className='report-medal' alt=''></img>
            ) : tableData.g >= 90 ? (
              <img src={gold} className='report-medal' alt=''></img>
            ) : (
              <img src={silver} className='report-medal' alt=''></img>
            )}
          </p>
        ) : (
          <p className='report-score-lose'>
            <span>{parseInt(tableData.g) + '%'}</span>
          </p>
        )}

        {/* <p className="report-score">20%</p> */}
        <div className='report-top-line'></div>
        {console.log(winOrLose)}
        {winOrLose ? (
          <p className='win'>You Win This Challenge Congratulations</p>
        ) : (
          <p className='lose'>
            You Lose This Challenge, try next time better...
          </p>
        )}
      </div>
      <div className='report-middle'>
        <div className='report-question'>
          <ReportQuestion
            question={question}
            example={example}
            constraints={constraints}
          />
        </div>

        <div className='report-submitted-code'>
          <AceEditor
            fontSize={16}
            mode='python'
            // onChange={onChange}
            height={'100%'}
            width={'100%'}
            theme='textmate'
            value={`${code}`}
            setOptions={{ readOnly: true }}
          />
        </div>
      </div>

      <div className='report-down'>
        <h1>Test cases</h1>
        <ResultTable x={tableData} />
      </div>
    </div>
  );
};

export default Report;
