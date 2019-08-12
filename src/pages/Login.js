import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ErrorModal from '../components/ErrorModal';
import { ApiService } from '../services/ApiService';
import { login } from '../actions/LoginActions';

import './Login.css';

export default function Login() {
  const [loginData, setLoginData] = useState({
    name: '',
    password: ''
  });
  const [boolLoginError, setBoolLoginError] = useState(false);

  const { boolLogged } = useSelector(state => state.LoginReducer);
  const dispatch = useDispatch();

  async function handleLogin(event) {
    event.preventDefault();
    const resp = await ApiService.login(loginData);
    if (resp.err) {
      setLoginData({ name: '', password: '' });
      return setBoolLoginError(true);
    }
    localStorage.setItem('token@bossabox', resp.token);
    localStorage.setItem('name@bossabox', loginData.name);
    return dispatch(login(loginData.name));
  }

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  }
  function closeError() {
    setBoolLoginError(false);
  }
  return (
    <>
      { boolLogged && <Redirect to="/" /> }
      { boolLoginError && (
      <ErrorModal close={closeError} title="Login Error" buttonMessage="Try Again">
        Check your log in data and try again...
      </ErrorModal>
      )}
      <div className="login-container">
        <form id="login" onSubmit={handleLogin}>
          <label>Name * </label>
          <input
            type="text"
            name="name"
            value={loginData.name}
            onChange={handleLoginChange}
            placeholder="Digite seu nome"
          />
          <label>Password * </label>
          <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} />
          <button className="but-primary-neutral" type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
