import React, { useState, useEffect } from 'react';
import '../../Room/Report/Report.css';
import AceEditor from 'react-ace';
import ResultTable from '../../ResultTable/ResultTable';
import ReportQuestion from '../../Room/Report/ReportQuestion/ReportQuestion';
import { getCookie, setCookie } from '../../../cookies';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ReportTest = ({
  code,
  tableData,
  question,
  pass,
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

      if (tableData.t !== 'none') {
        let tier;
        if (tableData.t === 'medium') {
          tier = 'Intermediate';
        } else tier = 'Beginner';
  
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className='custom-ui'>
                <h1>Your programming level is: {tier}</h1>
                <button onClick={() => onClose()} className='room-btn-alert'>
                  Ok
                </button>
              </div>
            );
          },
        });
      }
  }, []);
  return (
    <div className='report'>
      <div className='report-top'>
        <h1>Codewars</h1>
        <h2>Candidate Report: {userName}</h2>
        <h2>Test Score</h2>
        <p>{parseInt(tableData.g)} out of 100 points</p>
        {pass ? (
          <p className='report-score-win'>
            <span>{parseInt(tableData.g) + '%'}</span>
          </p>
        ) : (
          <p className='report-score-lose'>
            <span>{parseInt(tableData.g) + '%'}</span>
          </p>
        )}

        <div className='report-top-line'></div>
        {pass ? (
          <p className='win'>You Pass This Challenge Congratulations</p>
        ) : (
          <p className='lose'>
            You Failed This Challenge, try next time better...
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

export default ReportTest;
