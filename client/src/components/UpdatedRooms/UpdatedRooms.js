import React from 'react';
import socket from '../../socket';
import './UpdatedRooms.css';
import { getCookie } from '../../cookies';
import door from '../../assets/door.png';

const UpdatedRooms = ({ rooms, type }) => {
  console.log('----updated room rendred-----');

  console.log(rooms)
  return (
    <div>
      
      {rooms.map(room => (
         
        <div key={room.name} className = 'updatedRoomsContainer'>
          <button
            className={'roomsList-bts ' + room.tier} 
            onClick={() => {
              socket.emit('join', { id: getCookie('id'), room: room.name, roomLevel:room.tier });
            }}
          >
            <p className='roomsList-bts-text'>
              {room.name}
            </p>
            <img className='door-img' src={door} alt='' />
            <div id='icon-lang'>
              {type === 'python' ? (
                <img
                  height='30px'
                  src='https://img.icons8.com/color/48/000000/python.png'
                  alt='err'
                />
              ) : (
                ''
              )}
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default UpdatedRooms;
