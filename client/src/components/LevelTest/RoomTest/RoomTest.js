import React, { useState, useEffect } from 'react';
import Timer from '../../Timer/Timer';
import RoomNav from '../../NavBar/RoomNav/RoomNav';
import Question from '../../Room/Question/Question';
import Report from '../ReportTest/ReportTest';
import socket from '../../../socket';
import { setCookie, getCookie, deleteCookie } from '../../../cookies';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../../Room/Room.css';
import { confirmAlert } from 'react-confirm-alert';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-min-noconflict/ext-language_tools';

let END_POINT = 'https://codewars-project.herokuapp.com';
let PYTHON_CODE = '';

let startTime = [];
let endTime = [];
let arrOfTime = [];

const RoomTest = (props) => {
  const [question, setQuestion] = useState({});
  const [gameInProgress, setGameInProgress] = useState(true);
  const [outPut, setOutPut] = useState([]);
  const [codeFromTheEditor, setCodeFromTheEditor] = useState('');
  const [indexOfQuestion, setIndexOfQuestion] = useState(-1);
  const [example, setExample] = useState({});
  const [constraints, setConstraints] = useState([]);
  const [resultOfTable, setResultOfTable] = useState({});
  const [pass, setPass] = useState(false);

  const timeCounting = () => {
    let now = new Date().getTime();
    let hours = Math.floor((now % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((now % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((now % (1000 * 60)) / 1000);

    let arr = [hours, minutes, seconds];
    return arr;
  };

  useEffect(() => {
    startTime = timeCounting();
  }, []);

  useEffect(() => {
    socket.emit('getTestQuestion', getCookie('id'));

    socket.on(
      'startTest',
      ({ question, example, constraints, signature, index }) => {
        setIndexOfQuestion(index);
        setQuestion(question);
        setExample(example);
        setCodeFromTheEditor(signature);
        PYTHON_CODE = signature;
        setConstraints(constraints);
      }
    );

    socket.on('result', (result) => {
      setCodeFromTheEditor(result.code);
      setOutPut(result.res);
    });

    socket.on('goToTestResults', ({ testGrade, testResults, tier }) => {
      let tmp = {};
      if (testGrade >= 56) {
        setPass(true);
      }
      tmp.g = testGrade;
      tmp.o = testResults;
      tmp.t = tier;
      setResultOfTable(tmp);
      setGameInProgress(!gameInProgress);
      deleteCookie('test');
    });
  }, [END_POINT, window.location.search]);

  useEffect(() => {
    window.history.pushState(
      { name: 'on browser back click' },
      'on browser back click',
      window.location.href
    );
    window.history.pushState(
      { name: 'on browser back click' },
      'on browser back click',
      window.location.href
    );

    window.onpopstate = () => {
      let str = window.location.href;
      if (str.search('roomtest') !== -1) {
        confirmAlert({
          title: 'Leave the Test',
          message: 'Do you sure you want to leave?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => {
                socket.disconnect();
                deleteCookie('test');
                props.history.replace(`/leveltest`);
                window.location.reload();
              },
            },
            {
              label: 'No',
              onClick: () => {
                setCodeFromTheEditor(PYTHON_CODE);
              },
            },
          ],
          closeOnEscape: false,
          closeOnClickOutside: false,
        });
      } else {
        props.history.replace(`/leveltest`);
        window.location.reload();
      }
    };
  }, [window.onpopstate]);

  useEffect(() => {
    window.onbeforeunload = () => {
      let str = window.location.href;
      let name = getCookie('test');
      if (name === '') str = '';
      deleteCookie('test');
      setTimeout(() => {
        setCookie('test', true);
      }, 1000);
      return str.search('roomtest') !== -1
        ? 'Are you sure you want to close?'
        : null;
    };
  }, [window.onbeforeunload]);

  useEffect(() => {
    socket.on('submitingTest', () => {
      if (indexOfQuestion !== -1) endTest();
    });
  }, [indexOfQuestion]);

  const checkEndTest = () => {
    confirmAlert({
      title: 'Do you sure you want to submit?',

      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            endTest();
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
  };
  const endTest = () => {
    endTime = timeCounting();

    if (startTime[2] > endTime[2]) {
      arrOfTime[2] = endTime[2] + 60 - startTime[2];
      endTime[1] = endTime[1] - 1;
    } else arrOfTime[2] = endTime[2] - startTime[2];

    if (startTime[1] > endTime[1]) {
      arrOfTime[1] = endTime[1] + 60 - startTime[1];
      endTime[0] = endTime[0] - 1;
    } else arrOfTime[1] = endTime[1] - startTime[1];

    arrOfTime[0] = endTime[0] - startTime[0];

    let time =
      (arrOfTime[0] < 10 ? '0' + arrOfTime[0] : arrOfTime[0]) +
      ':' +
      (arrOfTime[1] < 10 ? '0' + arrOfTime[1] : arrOfTime[1]) +
      ':' +
      (arrOfTime[2] < 10 ? '0' + arrOfTime[2] : arrOfTime[2]);

    socket.emit('submitTestCode', {
      id: getCookie('id'),
      time,
      tname: question.title,
      indexOfQuestion,
      code: PYTHON_CODE,
    });
  };

  function onChange(codeFromEditor) {
    PYTHON_CODE = codeFromEditor;
  }

  const runCode = () => {
    socket.emit('compileCode', PYTHON_CODE);
  };

  return (
    <div id='room-container'>
      <RoomNav {...props} />
      {gameInProgress ? (
        <div id='game-play'>
          <div className='game-started-container'>
            <Timer room={-1} indexOfQuestion={indexOfQuestion} />
            <div id='game-started'>
              <Question
                question={question}
                example={example}
                constraints={constraints}
              />
              <div id='sperate'></div>
              <div id='editor-area'>
                <AceEditor
                  fontSize={16}
                  mode='python'
                  onChange={onChange}
                  height={'400px'}
                  width={'90%'}
                  className='editor'
                  value={`${codeFromTheEditor}`}
                  theme='textmate'
                  setOptions={{ enableLiveAutocompletion: true }}
                />

                <h3 className='editor-output'>Output:</h3>
                <div className='out-put'>
                  {outPut.map((element) => {
                    return <p>{element}</p>;
                  })}
                </div>

                <br />
                <div id='btns-area'>
                  <button className='btn run-code' onClick={runCode}>
                    <span className='material-icons play-arrow'>
                      play_arrow
                    </span>
                    <span className='run-code-span'>Run Code</span>
                  </button>
                  <button className='btn submit' onClick={checkEndTest}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='result-page'>
          <Report
            code={PYTHON_CODE}
            tableData={resultOfTable}
            question={question}
            pass={pass}
            example={example}
            constraints={constraints}
          />
        </div>
      )}
    </div>
  );
};

export default RoomTest;
