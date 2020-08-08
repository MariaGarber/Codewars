import React, { useState, useEffect } from 'react';
import './WarHistory.css';
import gold from '../../../assets/gold-medal.png';
import silver from '../../../assets/silver-medal.png';
import bronze from '../../../assets/bronze-medal.png';
import axios from 'axios';
import queryString from 'query-string';

const WarHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const { id } = queryString.parse(window.location.search);
    axios({
      method: 'get',
      url: 'https://codewars-project.herokuapp.com/getwarhistory',
      params: {
        cookie: id,
      },
    })
      .then((response) => {
        setHistory(response.data.warHistory.reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const timeCounting = (now) => {
    let hours = Math.floor((now % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((now % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((now % (1000 * 60)) / 1000);

    let time =
      (hours < 10 ? '0' + hours : hours) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds);

    return time;
  };

  return (
    <div className='war-history'>
      <table className='war-history-table'>
        <tr>
          <th>Challenge Name</th>
          <th>Status</th>
          <th>Score</th>
          <th>Time</th>
        </tr>
        {history.map((obj) => {
          return (
            <tr>
              <td>
                <div className='td-flex'>
                  {obj.chLevel === 'easy' ? (
                    <div className='war-history-beginner'></div>
                  ) : obj.chLevel === 'medium' ? (
                    <div className='war-history-intermediate'></div>
                  ) : (
                    <div className='war-history-expert'></div>
                  )}

                  <div className='war-history-verticly-center'>
                    {obj.chName}
                  </div>
                </div>
              </td>

              <td>
                <p>{obj.status}</p>
                {obj.status === 'Win' ? (
                  obj.score <= 70 ? (
                    <img src={bronze} className='war-history-imge' alt=''></img>
                  ) : obj.score >= 90 ? (
                    <img src={gold} className='war-history-imge' alt=''></img>
                  ) : (
                    <img src={silver} className='war-history-imge' alt=''></img>
                  )
                ) : null}
              </td>
              <td>{obj.score + '%'}</td>
              <td>{timeCounting(obj.time)}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default WarHistory;
