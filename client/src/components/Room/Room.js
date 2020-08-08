import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Timer from '../Timer/Timer';
import WinTimer from '../Timer/WinTimer';
import RoomNav from '../NavBar/RoomNav/RoomNav';
import Question from './Question/Question';
import Report from './Report/Report';
import socket from '../../socket';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import './Room.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import Loading from './Loading/Loading';
import { setCookie, getCookie, deleteCookie } from '../../cookies';


let END_POINT = 'https://codewars-project.herokuapp.com';
let PYTHON_CODE = '';
let START_TIME;
let END_TIME;

const Room = (props) => {
  console.log('Room page rendered');

  const [room, setRoom] = useState('');
  const [wating, setWating] = useState(true); // need to be true
  const [question, setQuestion] = useState({});
  const [gameInProgress, setGameInProgress] = useState(true);
  const [outPut, setOutPut] = useState([]);
  const [codeFromTheEditor, setCodeFromTheEditor] = useState('');
  const [indexOfQuestion, setIndexOfQuestion] = useState(-1);
  const [example, setExample] = useState({});
  const [constraints, setConstraints] = useState([]);
  const [resultOfTable, setResultOfTable] = useState({});
  const [win, setWin] = useState(false);
  const [winTimer, setWinTimer] = useState(false);

  const [firstSubmit, setFirstSubmit] = useState('');
  const timeCounting = () => {
    return new Date().getTime();
  };

  useEffect(() => {
    PYTHON_CODE = '';
    const { nameOfRoom } = queryString.parse(window.location.search);
    setRoom(nameOfRoom);

    socket.on(
      'startGame',
      ({ question, example, constraints, signature, index }) => {
        setQuestion(question);
        setExample(example);
        setConstraints(constraints);
        setIndexOfQuestion(index);
        setCodeFromTheEditor(signature);
        PYTHON_CODE = signature;
        START_TIME = timeCounting();
        setWating(!wating);
      }
    );

    socket.on('submiting', ({ room, indexOfQuestion, first }) => {
      setFirstSubmit(first)
      let btn = document.querySelector('#submit-btn')
      btn.disabled = true; 
      btn.style.backgroundColor = 'rgb(198, 198, 198)';
      btn.style.color = 'black'
      setWinTimer(true)
      setCodeFromTheEditor(PYTHON_CODE)
      END_TIME = timeCounting();
      let time = END_TIME - START_TIME;
      setTimeout( ()=>{
        socket.emit('submit', {
          room,
          indexOfQuestion,
          first,
          code: PYTHON_CODE,
          time,
        });
      },18000)
    });

    socket.on('goToResults', ({ room, infoAboutRoom, WINNER }) => {
      let tmp = {};
      if (socket.id.localeCompare(WINNER) === 0 || WINNER === -1) {
        console.log('you win:', socket.id);
        setWin(true);
      } else {
        console.log('you lose');
      }
      tmp.g = infoAboutRoom.rooms[room][socket.id].grade;
      tmp.o = infoAboutRoom.rooms[room][socket.id].output;
      setResultOfTable(tmp);
      socket.emit('leave-room', room);
      setGameInProgress(!gameInProgress);
      deleteCookie('room');
    });

    socket.on('result', (result) => {
      setCodeFromTheEditor(result.code);
      setOutPut(result.res);
    });

    socket.on('opponentLeft', () => {
      confirmAlert({
        customUI: () => {
          return (
            <div className='custom-ui'>
              <h1>Congratulations you won the war!!</h1>
              <p>
                Your opponent left the war and you will be transferred to the
                rooms page
              </p>
              <button
                className='room-btn-alert'
                onClick={() => {
                  deleteCookie('room');
                  props.history.push(`/rooms`);
                  window.location.reload();
                }}
              >
                Ok
              </button>
            </div>
          );
        },
        closeOnEscape: false,
        closeOnClickOutside: false,
      });
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
      let str = window.location.search;
      if (str.search('nameOfRoom=room') !== -1) {
        confirmAlert({
          title: 'Leave the Game',
          message: 'Do you sure you want to leave?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => {
                socket.disconnect();
                deleteCookie('room');
                props.history.replace(`/rooms`);
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
        props.history.replace(`/rooms`);
        window.location.reload();
      }
    };
  }, [window.onpopstate]);

  useEffect(() => {
    window.onbeforeunload = () => {
      let str = window.location.search;
      let name = getCookie('room');
      if (name === '') str = '';
      deleteCookie('room');
      setTimeout(() => {
        setCookie('room', name);
      }, 1000);
      return str.search('nameOfRoom=room') !== -1
        ? 'Are you sure you want to close?'
        : null;
    };
  }, [window.onbeforeunload]);

  const checkEndGame = () => {
    confirmAlert({
      title: 'Do you sure you want to submit ?',

      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            endGame();
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
  const endGame = () => {
    console.log('btn end game clicked', room);
    socket.emit('endGame', { room, indexOfQuestion });
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
          {wating ? (
            <Loading />
          ) : (
            <div className='game-started-container'>
              {
                winTimer ? <WinTimer firstSubmit={firstSubmit}/>
                : <Timer room={room} indexOfQuestion={indexOfQuestion} />
              }
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
                  <div className="out-and-btns">
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
                      <button id="submit-btn" className='btn submit' onClick={checkEndGame}>
                        Submit
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='result-page'>
          <Report
            code={PYTHON_CODE}
            tableData={resultOfTable}
            question={question}
            winOrLose={win}
            example={example}
            constraints={constraints}
          />
        </div>
      )}
    </div>
  );
};

export default Room;
