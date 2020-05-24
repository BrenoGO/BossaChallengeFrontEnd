import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ToolsService } from '../services/ToolsService';

import './Main.css';

import searchIcon from '../imgs/Icon-Search-2px.svg';

import AddModal from '../components/AddModal';
import Tool from '../components/Tool';
import ErrorModal from '../components/ErrorModal';

export default function App() {
  const [tools, setTools] = useState([]);
  const [connected, setConnected] = useState(true);
  const [searchedTag, setSearchedTag] = useState('');
  const [boolCheckSearchTag, setBoolCheckSearchTag] = useState(false);
  const [boolAddModal, setBoolAddModal] = useState(false);
  const [boolError, setBoolError] = useState(false);

  const { boolLogged } = useSelector(state => state.LoginReducer);

  useEffect(() => {
    ToolsService.list()
      .then(resp => {
        if (resp.err) {
          setConnected(false);
        } else {
          setTools(resp);
        }
      });
  }, []);

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

    if (boolCheckSearchTag) { // check was true, became false
      newTools = await ToolsService.list(); // get all
    } else if (searchedTag) { // check was false, became true, and searchedTag isnt '' empty
      newTools = await ToolsService.searchTag(searchedTag);
    }
    setBoolCheckSearchTag(!boolCheckSearchTag);
    return setTools(newTools);
  }

  function changeBoolAddModal() {
    if (boolLogged) {
      return setBoolAddModal(!boolAddModal);
    }
    return setBoolError(true);
  }

  function addTool(tool) {
    setTools([...tools, tool]);
    setBoolAddModal(false);
  }

  function removeTool(toolId) {
    setTools(tools.filter(tool => tool.id !== toolId));
  }

  function closeError() {
    setBoolError(false);
  }
  return (
    <>
      { boolError && (
      <ErrorModal title="Unauthorized" buttonMessage="Understood" close={closeError}>
        You can&apos;t add a tool while unauthenticated. Please Log In.
        test User: &quot;Teste&quot;, password: &quot;teste123&quot;
      </ErrorModal>
      )}
      <div id="Main">
        <div id="subHead">
          <div id="divInputTag">
            <img src={searchIcon} className="searchIcon" alt="searchIcon" />
            <input
              type="text"
              name="searchedTag"
              id="searchInput"
              onChange={handleSearchChange}
              value={searchedTag}
              placeholder="Search Tag"
            />
            <label className="labelCheck" htmlFor="searchTagCheckbox">
              <input
                id="searchTagCheckbox"
                type="checkbox"
                name="checkSearchTag"
                onChange={handleSearchChange}
                checked={boolCheckSearchTag}
              />
              <span className="longCheckSpan">search in tags only</span>
            </label>
          </div>
          <div id="divButAdd">
            <button id="addBut" className="but-secondary-neutral" onClick={changeBoolAddModal}>
              <span className="symbolInButton">+</span>Add
            </button>
          </div>
        </div>
        <div id="body">
          { boolAddModal && (
          <AddModal changeFunction={changeBoolAddModal} addTool={addTool} />
          )}
          {!connected && (
          <h2>No server connection</h2>
          )}
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
    </>
  );
}
