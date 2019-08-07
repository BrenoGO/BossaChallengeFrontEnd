import React, { useState, useEffect } from 'react';
import './App.css';
import { ApiService } from './services/ApiService';
import { ToolsService } from './services/ToolsService';

import AddModal from './components/AddModal';
import Tool from './components/Tool';

export default function App() {
  const [loginData, setLoginData] = useState({
    name: '',
    password: '',
    logged: false
  });
  const [connected, setConnected] = useState(true);
  const [tools, setTools] = useState([]);
  const [searchedTag, setSearchedTag] = useState('');
  const [boolCheckSearchTag, setBoolCheckSearchTag] = useState(false);
  const [boolAddModal, setBoolAddModal] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem('token@bossabox');
    const name = localStorage.getItem('name@bossabox') ? localStorage.getItem('name@bossabox') : '';
    setLoginData({ password: '', logged, name });
    ToolsService.list()
      .then(resp => {
        if (resp.err) {
          setConnected(false);
        } else {
          setTools(resp);
        }
      });
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    const resp = await ApiService.login(loginData);
    if (resp.err) {
      alert(resp.err);
      setLoginData({ name: '', password: '', logged: false });
    } else {
      localStorage.setItem('token@bossabox', resp.token);
      localStorage.setItem('name@bossabox', loginData.name);
      setLoginData({ ...loginData, logged: true, password: '' });
    }
  }

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  }

  async function handleSearchChange(event) {
    const { name, value } = event.target;
    let newTools = [];
    if (name === 'searchedTag') {
      setSearchedTag(value);
      if (value === '') {
        newTools = await ToolsService.list();
        setBoolCheckSearchTag(false);
      } else {
        newTools = await ToolsService.searchTag(value);
        setBoolCheckSearchTag(true);
      }
      return setTools(newTools);
    }// name === 'checkSearchTag' - checkbox clicked
    setBoolCheckSearchTag(!boolCheckSearchTag);
    if (!boolCheckSearchTag) { // check is false
      newTools = await ToolsService.list(); // get all
    } else if (searchedTag) { // check were false, became true, and searchedTag isnt ''
      newTools = await ToolsService.searchTag(searchedTag);
    }
    return setTools(newTools);
  }

  function changeBoolAddModal() {
    setBoolAddModal(!boolAddModal);
  }

  function addTool(tool) {
    setTools([...tools, tool]);
    setBoolAddModal(false);
  }

  function removeTool(toolId) {
    setTools(tools.filter(tool => tool.id !== toolId));
  }

  function showModal() {
    if (boolAddModal) {
      return (
        <AddModal changeFunction={changeBoolAddModal} addTool={addTool} />
      );
    }
    return false;
  }

  function isNotConnected() {
    if (!connected) {
      return <h2>No server connection</h2>;
    }
    return false;
  }

  function loginArea() {
    const { logged, name, password } = loginData;
    if (!logged) {
      return (
        <form id="login" onSubmit={handleLogin}>
          <label className="labelLogin">
            Name:
            <input type="text" name="name" value={name} onChange={handleLoginChange} />
          </label>
          <label className="labelLogin">
            Password:
            <input type="password" name="password" value={password} onChange={handleLoginChange} />
          </label>
          <button type="submit">Login</button>
        </form>
      );
    }
    return <p>Welcome {name}</p>;
  }

  return (
    <div className="App">
      <div id="header">
        <div id="titles">
          <h1>VUTTR</h1>
          <h2>Very Useful Tools To Remember</h2>
        </div>
        <div id="rightHead">
          {loginArea()}
        </div>
      </div>
      <div id="subHead">
        <div id="divInputTag">
          <input type="text" name="searchedTag" onChange={handleSearchChange} value={searchedTag} />
          <input type="checkbox" name="checkSearchTag" onChange={handleSearchChange} checked={boolCheckSearchTag} />
        </div>
        <div id="divButAdd">
          <button id="addBut" onClick={changeBoolAddModal}>
            <span id="addSymbol">+</span>Add
          </button>
        </div>
      </div>
      <div id="body">
        {showModal()}
        {isNotConnected()}
        <div id="list">
          {
            tools.map(
              tool => (
                <Tool
                  key={tool._id}
                  tool={tool}
                  removeTool={removeTool}
                  searchedTag={searchedTag}
                />
              )
            )
          }
        </div>
      </div>
    </div>
  );
}
