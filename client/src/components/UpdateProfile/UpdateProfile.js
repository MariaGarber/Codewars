import React, { useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './UpdateProfile.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoggedInNav from '../NavBar/LoggedInNav/LoggedInNav';
import av1 from '../../assets/avatars/av1.jpg';
import av2 from '../../assets/avatars/av2.jpg';
import av3 from '../../assets/avatars/av3.jpg';
import av4 from '../../assets/avatars/av4.jpg';
import av5 from '../../assets/avatars/av5.jpg';
import av6 from '../../assets/avatars/av6.jpg';
import av7 from '../../assets/avatars/av7.jpg';
import av8 from '../../assets/avatars/av8.jpg';
import av9 from '../../assets/avatars/av9.jpg';
import av10 from '../../assets/avatars/av10.jpg';
import av11 from '../../assets/avatars/av11.jpg';
import av12 from '../../assets/avatars/av12.jpg';
import axios from 'axios';
import { getCookie, deleteCookie, setCookie } from '../../cookies';
import { confirmAlert } from 'react-confirm-alert';
import { CountryDropdown } from 'react-country-region-selector';
import loadingIcon2 from '../../assets/loading-axios-trans.gif'

const UpdateProfile = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [startDate, setStartDate] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');

  const imgSelected = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Avatar selected</h1>
            <p>Press update to save the changes</p>
            <button onClick={() => onClose()} className='room-btn-alert'>
              Ok
            </button>
          </div>
        );
      },
    });
  };

  const updateProfileData = () => {
    let updateBtn = document.querySelector('.update-profile-btn')
    let img = document.querySelector('.loading-icon')
    img.style.display = 'block'
    updateBtn.style.display = 'none'

    if (newPassword !== '' && newPassword !== confirmPassword) {
      setNewPassword('');
      setConfirmPassword();
      setCurrentPassword();
      window.alert('Passwords not match');
    } else {
      let tmp = {};
      tmp.id = getCookie('id');
      tmp.firstName = firstName;
      tmp.lastName = lastName;
      tmp.birthday = birthday;
      tmp.newPassword = newPassword;
      tmp.currentPassword = currentPassword;
      tmp.pic = profileImg;
      tmp.country = country;
      tmp.gender = gender;
      axios
        .put('https://codewars-project.herokuapp.com/update', tmp)
        .then((response) => {
          confirmAlert({
            customUI: () => {
              return (
                <div className='custom-ui'>
                  <h1>{response.data}</h1>
                  <button
                    className='room-btn-alert'
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Ok
                  </button>
                </div>
              );
            },
          });
          if (firstName !== '') {
            setCookie('name', firstName, 0.25);
          }
          if (profileImg !== '') {
            setCookie('profilePic', profileImg, 0.25);
          }
        })
        .catch((error) => {
          alert(error.response.data);
        });
    }
  };

  const deleteAccount = () => {
    confirmAlert({
      title: 'Delete Account',
      message:
        'Do you sure you want to delete your account? \n all your data will be lost',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            axios
              .delete('https://codewars-project.herokuapp.com/deleteaccount', {
                data: { cookie: getCookie('id') },
              })
              .then((response) => {
                confirmAlert({
                  customUI: () => {
                    return (
                      <div className='custom-ui'>
                        <h1>{response.data}</h1>
                        <a
                          href='/'
                          onClick={() => {
                            deleteCookie('id');
                            deleteCookie('name');
                          }}
                        >
                          <button className='room-btn-alert'>Ok</button>
                        </a>
                      </div>
                    );
                  },
                });
              })
              .catch((error) => {
                console.log(error);
              });
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

  return (
    <div className='update-profile-wrapper'>
      <div className='update-profile'>
        <LoggedInNav />
        <div className='update-profile-container'>
          <div className='update-profile-info'>
            <h2>Information:</h2>
            <div className='update-profile-info-flex'>
              <div className='update-profile-info-left'>
                <div className='update-profile-info-div'>
                  <label>
                    <b>First Name:</b>
                  </label>
                  <br />
                  <input
                    className='update-profile-inputs'
                    type='text'
                    value={firstName}
                    onChange={(e) => {
                      let name = e.target.value;
                      setFirstName(
                        name.charAt(0).toUpperCase() + name.slice(1)
                      );
                    }}
                  />
                </div>

                <div className='update-profile-info-div'>
                  <label>
                    <b>Last Name:</b>
                  </label>
                  <br />
                  <input
                    className='update-profile-inputs'
                    type='text'
                    value={lastName}
                    onChange={(e) => {
                      let name = e.target.value;
                      setLastName(name.charAt(0).toUpperCase() + name.slice(1));
                    }}
                  />
                </div>

                <div>
                  <label className='update-profile-date-of-birth'>
                    <b>Date of birth:</b>
                  </label>
                  <DatePicker
                    placeholderText='select date'
                    selected={startDate}
                    onChange={(date) => {
                      let day = date.getDate();
                      let month = date.getMonth() + 1;
                      let year = date.getFullYear();
                      let fullDate = day + '/' + month + '/' + year;
                      setStartDate(date);
                      setBirthday(fullDate);
                    }}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode='select'
                    className='date-picker date-picker-color'
                    dateFormat='dd/MM/yyyy'
                    maxDate={new Date()}
                  />
                </div>

                <label>
                  <b>Country:</b>{' '}
                </label>
                <CountryDropdown
                  value={country}
                  onChange={(val) => setCountry(val)}
                  className='country-dropdown'
                />

                <div className='update-profile-radiobtns'>
                  <label>Gender:</label>
                  <input
                    id='Other'
                    name='gender'
                    type='radio'
                    checked={gender === 'Other'}
                    onChange={() => setGender('Other')}
                  />
                  <p>Other</p>

                  <input
                    id='Female'
                    name='gender'
                    type='radio'
                    checked={gender === 'Female'}
                    onChange={() => setGender('Female')}
                  />
                  <p>Female</p>
                  <input
                    id='Male'
                    name='gender'
                    type='radio'
                    checked={gender === 'Male'}
                    onChange={() => setGender('Male')}
                  />
                  <p>Male</p>
                </div>
              </div>

              <div className='update-profile-info-right'>
                <img
                  src={av1}
                  alt=''
                  onClick={() => {
                    setProfileImg('av1');
                    imgSelected();
                  }}
                />
                <img
                  src={av2}
                  alt=''
                  onClick={() => {
                    setProfileImg('av2');
                    imgSelected();
                  }}
                />
                <img
                  src={av3}
                  alt=''
                  onClick={() => {
                    setProfileImg('av3');
                    imgSelected();
                  }}
                />
                <img
                  src={av4}
                  alt=''
                  onClick={() => {
                    setProfileImg('av4');
                    imgSelected();
                  }}
                />
                <img
                  src={av5}
                  alt=''
                  onClick={() => {
                    setProfileImg('av5');
                    imgSelected();
                  }}
                />
                <img
                  src={av6}
                  alt=''
                  onClick={() => {
                    setProfileImg('av6');
                    imgSelected();
                  }}
                />
                <img
                  src={av7}
                  alt=''
                  onClick={() => {
                    setProfileImg('av7');
                    imgSelected();
                  }}
                />
                <img
                  src={av8}
                  alt=''
                  onClick={() => {
                    setProfileImg('av8');
                    imgSelected();
                  }}
                />
                <img
                  src={av9}
                  alt=''
                  onClick={() => {
                    setProfileImg('av9');
                    imgSelected();
                  }}
                />
                <img
                  src={av10}
                  alt=''
                  onClick={() => {
                    setProfileImg('av10');
                    imgSelected();
                  }}
                />
                <img
                  src={av11}
                  alt=''
                  onClick={() => {
                    setProfileImg('av11');
                    imgSelected();
                  }}
                />
                <img
                  src={av12}
                  alt=''
                  onClick={() => {
                    setProfileImg('av12');
                    imgSelected();
                  }}
                />
              </div>
            </div>
          </div>

          <div className='update-profile-pass'>
            <h2>Password:</h2>

            <div className='update-profile-pass-flex'>
              <div className='update-profile-pass-left'>
                <div className='update-profile-pass-div'>
                  <label>New Password:</label>
                  <br />
                  <input
                    className='update-profile-inputs'
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className='update-profile-pass-right'>
                <div className='update-profile-pass-div'>
                  <label>Confirm Password:</label>
                  <br />
                  <input
                    className='update-profile-inputs'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className='update-profile-pass-bottom'>
              <div className='update-profile-pass-div'>
                <label>
                  Current Password (needed if you want to change your password):
                </label>
                <br />
                <input
                  className='update-profile-inputs'
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className='delete-account'>
            <h2>Delete Account</h2>
            <p>
              If you wish you can delete your account. Your authored kata,
              solutions and comments will remain but will instead be attached to
              a generic profile that is not associated with any of your personal
              information. After deleting your account you are free to sign up
              again using the same email address.
            </p>
            <button onClick={deleteAccount}>DELETE MY ACCOUNT</button>
          </div>
          <div className='update-and-loading'>
            <button className='update-profile-btn' onClick={updateProfileData}>
              Update
            </button>
            <img className="loading-icon" src={loadingIcon2} alt=""/>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
