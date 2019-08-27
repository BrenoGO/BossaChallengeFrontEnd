import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ToolsService } from '../services/ToolsService';

import ErrorModal from './ErrorModal';
import './Tool.css';

export default function Tool(props) {
  const { tool, searchedTag, removeTool } = props;

  const [boolError, setBoolError] = useState(false);

  const { boolLogged } = useSelector(state => state.LoginReducer);

  async function remove() {
    if (!boolLogged) {
      return setBoolError(true);
    }
    ToolsService.remove(tool.id);
    return removeTool(tool.id);
  }

  function closeError() {
    setBoolError(false);
  }

  return (
    <>
      { boolError && (
        <ErrorModal title="Unauthorized" buttonMessage="Understood" close={closeError}>
          You can&apos;t remove a tool while unauthenticated. Please Log In.
        </ErrorModal>
      )}
      <div className="Tool">
        <div className="toolHeader">
          <a href={tool.link} target="_blank" rel="noopener noreferrer">
            <h3 className="toolTitle">{tool.title}</h3>
          </a>
          <button className="removeBut but-secondary-danger" onClick={remove}><span className="symbolInButton">x</span>Remove</button>
        </div>
        <div className="toolDescription">
          <p>{tool.description}</p>
        </div>
        <div className="toolTags">
          <p>
            {tool.tags.map((tag, index) => {
              if (searchedTag === tag) {
                return <strong key={index}><mark>#{tag}</mark> </strong>;
              }
              return <strong key={index}>#{tag} </strong>;
            })}
          </p>
        </div>
      </div>
    </>
  );
}
