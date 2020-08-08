import React, { useState, useEffect } from 'react';
import './Stats.css';
import ColumnChart from '../ColumnChart/ColumnChart';
// import Column from '../Chart/Chart';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import gold from '../../../assets/gold-medal.png';
import silver from '../../../assets/silver-medal.png';
import bronze from '../../../assets/bronze-medal.png';
import queryString from 'query-string';

const Stats = () => {
  const [totalGames, setTotalGames] = useState(0);
  const [losses, setLosses] = useState(0);
  const [wins, setWins] = useState(0);
  const [grade, setGrade] = useState(0);
  const [medals, setMedals] = useState({});
  const [times, setTimes] = useState([
    {
      longestWin: 0,
      fastestWin: 0,
      avgWin: 0,
      ration: 0,
    },
    {
      longestWin: 0,
      fastestWin: 0,
      avgWin: 0,
      ration: 0,
    },
    {
      longestWin: 0,
      fastestWin: 0,
      avgWin: 0,
      ration: 0,
    },
  ]);

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

  useEffect(() => {
    const { id } = queryString.parse(window.location.search);
    axios({
      method: 'get',
      url: 'https://codewars-project.herokuapp.com/getstats',
      params: {
        cookie: id,
      },
    })
      .then((response) => {
        setTotalGames(response.data.total_games);
        setLosses(response.data.losses);
        setWins(response.data.wins);
        setMedals(response.data.medals);
        console.log(response.data.medals);
        let avg = 0;
        if (response.data.grades.length !== 0)
          avg =
            response.data.grades.reduce((a, b) => a + b, 0) /
            response.data.grades.length;

        setGrade(parseInt(avg));
        setTimes(response.data.times);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className='stats'>
      <div className='stats-up'>
        <div className='stats-up-left'>
          <h2>Total Score:</h2>
          <CircularProgressbar
            className='circular-progressbar'
            value={grade}
            text={`${grade}%`}
          />
        </div>

        <div className='stats-up-right'>
          <div className='stats-up-right-box'>
            <h2>Match Played</h2>
            <h1>{totalGames}</h1>
          </div>

          <div className='stats-up-right-box'>
            <h2>Wins</h2>
            <div className='stats-up-right-box-flex'>
              <div>
                <p>{medals.gold}</p>
                <img src={gold} alt='' />
              </div>
              <div>
                <p>{medals.silver}</p>
                <img src={silver} alt='' />
              </div>
              <div>
                <p>{medals.bronze}</p>
                <img src={bronze} alt='' />
              </div>
            </div>
          </div>

          <div className='stats-up-right-box'>
            <h2>W/L ratio</h2>
            <h1>{(losses !== 0 ? wins / losses : wins).toFixed(2)}</h1>
          </div>
        </div>
      </div>

      <div className='stats-down'>
        <div className='stats-down-left'>
          <div className='stats-games-chart'>
            <ColumnChart losses={losses} wins={wins} />
          </div>
        </div>

        <div className='stats-down-right'>
          <div className='stats-down-right-box'>
            <h2 className='stats-beginner'>Beginner Wars</h2>
            <div className='stats-down-right-line'></div>

            <div className='stats-down-right-box-flex'>
              <b>Longest Win</b>
              <label>{timeCounting(times[0].longestWin)}</label>
            </div>
            <div className='stats-down-right-box-flex'>
              <b>Fastest Win</b>
              <label>{timeCounting(times[0].fastestWin)}</label>
            </div>
            <div className='stats-down-right-box-flex'>
              <b>AVG Win</b>
              <label>
                {timeCounting(
                  times[0].wins !== 0
                    ? times[0].avgWin / times[0].wins
                    : times[0].avgWin
                )}
              </label>
            </div>
            <div className='stats-down-right-box-flex'>
              <b>W/L Ratio</b>
              <label>
                {(times[0].losses !== 0
                  ? times[0].wins / times[0].losses
                  : times[0].wins
                ).toFixed(2)}
              </label>
            </div>
          </div>

          <div className='stats-down-right-box'>
            <h2 className='stats-intermediate'>Intermediate Wars</h2>
            <div className='stats-down-right-line'></div>

            <div className='stats-down-right-box-flex'>
              <b>Longest Win</b>
              <label>{timeCounting(times[1].longestWin)}</label>
            </div>
            <div className='stats-down-right-box-flex'>
              <b>Fastest Win</b>
              <label>{timeCounting(times[1].fastestWin)}</label>
            </div>
            <div className='stats-down-right-box-flex'>
              <b>AVG Win</b>
              <label>
                {timeCounting(
                  times[1].wins !== 0
                    ? times[1].avgWin / times[1].wins
                    : times[1].avgWin
                )}
              </label>
            </div>
            <div className='stats-down-right-box-flex'>
              <b>W/L Ratio</b>
              <label>
                {(times[1].losses !== 0
                  ? times[1].wins / times[0].losses
                  : times[1].wins
                ).toFixed(2)}
              </label>
            </div>
          </div>

          <div className='stats-down-right-box'>
            <h2 className='stats-expert'>Expert Wars</h2>
            <div className='stats-down-right-line'></div>

            <div className='stats-down-right-box-flex'>
              <b>Longest Win</b>
              <label>{timeCounting(times[2].longestWin)}</label>
            </div>
            <div className='stats-down-right-box-flex'>
              <b>Fastest Win</b>
              <label>{timeCounting(times[2].fastestWin)}</label>
            </div>
            <div className='stats-down-right-box-flex'>
              <b>AVG Win</b>
              <label>{timeCounting(times[2].avgWin)}</label>
            </div>
            <div className='stats-down-right-box-flex'>
              <b>W/L Ratio</b>
              <label>
                {(times[2].losses !== 0
                  ? times[2].wins / times[0].losses
                  : times[2].wins
                ).toFixed(2)}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
