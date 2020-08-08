import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '../src/components/Login/Login';
import Register from '../src/components/Register/Register';
import LevelTest from '../src/components/LevelTest/LevelTest';
import RoomsPage from '../src/components/RoomsPage/RoomsPage';
import { ProtectedRoute } from './protected.route';
import { ProtectedRoom } from './protectedRoom.route';
import { ProtectedRoot } from './protectedRoot.route';
import Profile from '../src/components/Profile/Profile';
import UpdateProfile from '../src/components/UpdateProfile/UpdateProfile';
import Faq from './components/FaqPage/FaqPage';
import RoomTest from './components/LevelTest/RoomTest/RoomTest';
import Room from '../src/components/Room/Room';
import ForgetPassword from '../src/components/ForgetPassword/ForgetPassword';
import Contact from '../src/components/Contact/Contact';
import SearchResult from '../src/components/SearchResult/SearchResult';

import './App.css';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <div className='app-container'>
          <Switch>
            <ProtectedRoot path='/' exact />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/faq' component={Faq} />
            <ProtectedRoute path='/leveltest' component={LevelTest} />
            <ProtectedRoom
              path='/room'
              component={Room}
              cname={'room'}
              pname={'/rooms'}
            />
            <ProtectedRoute path='/rooms' component={RoomsPage} />
            <ProtectedRoute path='/profile' component={Profile} />
            <ProtectedRoute path='/update' component={UpdateProfile} />
            <ProtectedRoom
              path='/roomtest'
              component={RoomTest}
              cname={'test'}
              pname={'/leveltest'}
            />
            <Route path='/changepass' component={ForgetPassword} />
            <ProtectedRoute path='/contact' component={Contact} />
            <ProtectedRoute path='/searchresults' component={SearchResult} />
            <Route path='*' component={() => '404 PAGE NOT FOUND'} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
