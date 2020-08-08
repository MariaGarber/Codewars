import React, { useEffect } from 'react';
import './Timer.css';
import socket from '../../socket';
const Timer = ({ room, indexOfQuestion }) => {
  useEffect(() => {
    initTimer();
  }, []);

  const initTimer = () => {
    var time = new Date();
    time.setHours(time.getHours() + 2);
    // time.setSeconds(time.getSeconds() + 30);
    var countDownDate = new Date(time).getTime();

    var x = setInterval(function () {
      var now = new Date().getTime();

      var distance = countDownDate - now;

      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let demo = document.querySelector('.demo');
      if (demo !== null) {
        demo.innerHTML = hours + 'h ' + minutes + 'm ' + seconds + 's ';
        if (distance < 0) {
          clearInterval(x);
          demo.innerHTML = 'EXPIRED';
          if (room === -1) {
            socket.emit('testTimeout');
          } else {
            socket.emit('timeout', { room, indexOfQuestion });
          }
        }
      }
    }, 1000);
  };

  const hideTimer = () => {
    let timerContainer = document.querySelector('.demo');
    timerContainer.classList.toggle('hide-timer');
  };

  return (
    <div className='timer'>
      <div className='timer-container'>
        <p>War Started!</p>
        <span className='material-icons timer-icon'>timer</span>
        <h2 className='demo'></h2>
        <button className='hide-timer-btn' onClick={hideTimer}>
          Hide Timer
        </button>
      </div>

      <p className='timer-top-para'>
        After 2 hours the system will submit automatically the challenge.
      </p>
    </div>
  );
};

export default Timer;
