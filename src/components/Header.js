import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logout } from '../actions/LoginActions';
import './Header.css';

function Header({ location }) {
  const { pathname } = location;

  const { boolLogged, userName } = useSelector(state => state.LoginReducer);
  const dispatch = useDispatch();

  function clearLog() {
    dispatch(logout);
    localStorage.clear();
  }

  return (
    <div id="header">
      <div id="titles">
        <h1><Link to="/">VUTTR</Link></h1>
        <h2>Very Useful Tools To Remember</h2>
      </div>
      <div id="rightHead">
        { boolLogged
          ? (
            <div id="logDiv">
              <p>Welcome {userName}</p>
              <Link to="/login">
                <button type="button" className="but-secondary-neutral" onClick={clearLog}>Log Out</button>
              </Link>
            </div>
          )
          : (
            <div id="logDiv">
              { pathname !== '/login' && (
                <Link to="/login">
                  <button type="button" className="but-primary-neutral">Log In</button>
                </Link>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
}

export default withRouter(Header);
