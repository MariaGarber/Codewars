import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Register.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CountryDropdown } from 'react-country-region-selector';
import NavBarLogin from '../NavBar/NavBarLogin/NavBarLogin';
import { setCookie } from '../../cookies';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import loadingIcon from '../../assets/loading-axios.gif'

// import HelpIcon from '@material-ui/icons/Help';
// import Tooltip from '@material-ui/core/Tooltip';
// import blue from '@material-ui/core/colors/blue';

const Register = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [startDate, setStartDate] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('Other');
  const [level, setLevel] = useState('Beginner');
  const [learn, setLearn] = useState('Alone');
  const [err, setErr] = useState('');
  const [show, setShow] = useState('');

  useEffect(() => {
    let day = birthday.getDate();
    let month = birthday.getMonth() + 1;
    let year = birthday.getFullYear();
    let fullDate = day + '/' + month + '/' + year;
    setStartDate(fullDate);
  }, []);

  const addUser = () => {
    let registerBtn = document.querySelector('.register-btn')
    let img = document.querySelector('.loading-icon')
    img.style.display = 'block'
    registerBtn.style.display = 'none'
    let tmp = {};
    tmp.firstName = firstName;
    tmp.lastName = lastName;
    tmp.email = email;
    tmp.password = password;
    tmp.startDate = startDate;
    tmp.country = country;
    tmp.gender = gender;
    tmp.level = level;
    tmp.learn = learn;
    axios
      .post('https://codewars-project.herokuapp.com/register', tmp)
      .then((response) => {
        img.style.display = 'none'
        registerBtn.style.display = 'block'
        if (!response.data.id) {
          setErr(response.data);
          setShow(true);
          setTimeout(() => {
            setErr('');
          }, 6000);

          setTimeout(() => {
            setShow(false);
          }, 6250);
        } else {
          window.alert('You Registered!');
          setCookie('id', response.data.id, 0.25);
          setCookie('name', firstName, 0.25);
          setCookie('exp', 0, 0.25);
          setCookie('level', 0, 0.25);
          setCookie('profilePic', response.data.pic, 0.25);
          props.history.push({ pathname: '/' });
        }
      })
      .catch((error) => {
        console.log(error.data);
      });
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '70%',
      margin: '2% auto',
      transitions: '0.5s',
    },
  }));
  const classes = useStyles();

  return (
    <div className='full-height'>
      <NavBarLogin />
      <div className='register-container'>
        <div className='register-left'>
          <div className='register-left-form-container'>
            <h1>Sign up to Codewars</h1>
            {show ? (
              <div className={classes.root}>
                <Fade in={err}>
                  <Alert severity='error' variant='filled'>
                    {err}
                  </Alert>
                </Fade>
              </div>
            ) : null}
            <input
              id='first-name'
              className='register-input'
              type='text'
              placeholder='First name'
              onChange={(e) => {
                let name = e.target.value;
                setFirstName(name.charAt(0).toUpperCase() + name.slice(1));
              }}
            />

            <input
              id='last-name'
              className='register-input'
              type='text'
              placeholder='Last name'
              onChange={(e) => {
                let name = e.target.value;
                setLastName(name.charAt(0).toUpperCase() + name.slice(1));
              }}
            />

            <div className='input-div'>
              <input
                className='register-input'
                type='email'
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='input-div'>
              <input
                className='register-input'
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className='register-date'>
              <label>
                <b>Date of birth: </b>
              </label>
              <DatePicker
                selected={birthday}
                onChange={(date) => {
                  let day = date.getDate();
                  let month = date.getMonth() + 1;
                  let year = date.getFullYear();
                  let fullDate = day + '/' + month + '/' + year;
                  setStartDate(fullDate);
                  setBirthday(date);
                }}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
                className='date-picker'
                dateFormat='dd/MM/yyyy'
                maxDate={new Date()}
              />
            </div>

            <div className='register-country'>
              <label>
                <b>Country:</b>{' '}
              </label>
              <CountryDropdown
                value={country}
                onChange={(val) => setCountry(val)}
                className='country-dropdown'
              />
              {/* <RegionDropdown
                country={country}
                value={region}
                onChange={(val) => setRegion(val)} 
            /> */}
            </div>
            <div className='register-radio-btns'>
              <p>Gender: </p>
              <input
                id='Other'
                name='gender'
                type='radio'
                checked={gender === 'Other'}
                onChange={() => setGender('Other')}
              />
              <label>Other</label>

              <input
                id='Female'
                name='gender'
                type='radio'
                checked={gender === 'Female'}
                onChange={() => setGender('Female')}
              />
              <label>Female</label>
              <input
                id='Male'
                name='gender'
                type='radio'
                checked={gender === 'Male'}
                onChange={() => setGender('Male')}
              />
              <label>Male</label>
            </div>

            <div className='register-level-radio-btns'>
              <div className='register-tool-tip'>
                <p>What is your programing level?</p>
                {/* <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  title='Add'
                >
                  <HelpIcon style={{ fontSize: 20, color: blue[900] }} />
                </Tooltip> */}
              </div>
              <input
                id='Beginner'
                name='level'
                type='radio'
                checked={level === 'Beginner'}
                onChange={() => setLevel('Beginner')}
              />
              <label>Beginner</label>

              <input
                id='Intermediate'
                name='level'
                type='radio'
                checked={level === 'Intermediate'}
                onChange={() => setLevel('Intermediate')}
              />
              <label>Intermediate</label>

              <input
                id='Expert'
                name='level'
                type='radio'
                checked={level === 'Expert'}
                onChange={() => setLevel('Expert')}
              />
              <label>Expert</label>
            </div>

            <div className='register-level-radio-btns'>
              <p>Where you learn to code?</p>
              <input
                id='Alone'
                name='learn'
                type='radio'
                checked={learn === 'Alone'}
                onChange={() => setLearn('Alone')}
              />
              <label>Alone</label>

              <input
                id='School'
                name='learn'
                type='radio'
                checked={learn === 'School'}
                onChange={() => setLearn('School')}
              />
              <label>School</label>

              <input
                id='Academia'
                name='learn'
                type='radio'
                checked={learn === 'Academia'}
                onChange={() => setLearn('Academia')}
              />
              <label>Academia</label>

              <input
                id='Work'
                name='learn'
                type='radio'
                checked={learn === 'Work'}
                onChange={() => setLearn('Work')}
              />
              <label>Work</label>
            </div>

            <div className='loading-and-btn'>
              <button className='register-btn' onClick={addUser}>
                SIGN UP
              </button>
              <img className="loading-icon" src={loadingIcon} alt=""/>
              </div>
      
          </div>
        </div>

        <div className='register-right'>
          <div className='register-right-text-container'>
            <h1>Already have an account?</h1>
            <p>To keep connected with us please</p>
            <p>login with your personal data</p>
            <Link to='/login'>
              <button id='sigh-in-btn'>SIGN IN</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
