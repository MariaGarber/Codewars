import React, { useEffect } from 'react';
import './WinTimer.css';
import socket from '../../socket';
import loadingIcon from '../../assets/loading-axios.gif'

const WinTimer = ({firstSubmit}) => {
  useEffect(() => {
    initTimer();
  }, []);

  const initTimer = () => {

    var timeleft = 15;
    var downloadTimer = setInterval( () =>{
        if(timeleft <= 0){
        clearInterval(downloadTimer);
        document.querySelector(".demo2-txt").innerHTML = "Finished";
        document.querySelector(".demo2").style.display='none'
        document.querySelector(".loading-room").style.display='inline'
        } else {
        document.querySelector(".demo2").innerHTML ='the code will be automatically submitted in '
        + timeleft + " seconds";
        }
        timeleft -= 1;
    }, 1000);

  };

  return (
    <div className='win-timer'>
      <div className='win-timer-container'>
        <div className="win-timer-flex">
            <span className='material-icons timer-icon'>timer</span>
          {socket.id === firstSubmit ? 
            <h2 className='demo2-txt'>Well done!</h2>
          :   
          <h2 className='demo2-txt'>Your opponent submitted his code</h2>

          }
        </div>
        <img className='loading-room' src={loadingIcon} alt=""/>
        <h2 className='demo2'></h2>
      </div>
    </div>
  );
};

export default WinTimer;
