import React from 'react';
import ReactLoading from 'react-loading';
import './Loading.css';

const Loading = ({ type, color }) => {
  // const [flag, setFlag] = useState(true);

  // setTimeout(() => {
  //     setFlag(!flag)
  //   }, 3000);



  return (
    <div className='Loading'>
      <div className="loading-center">
        <div className='loading-text'>
          <h1><span className="Waiting-effect">Waiting for opponent</span></h1>
          <h2 className="Waiting-effect">it may take few seconds please wait...</h2>
        </div>
        <ReactLoading
          className='loading-bars'
          type={'bars'}
          color={'white'}
        />
      </div>

    </div>
  );
};

export default Loading;
