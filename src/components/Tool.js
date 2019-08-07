import React from 'react';
import { ToolsService } from '../services/ToolsService';

import './Tool.css';

const Tool = props => {
  const { tool, searchedTag } = props;

  async function removeTool() {
    ToolsService.remove(tool.id)
      .then((res) => {
        if (res.err) {
          if (res.err.toString().match(/authorized/i)) {
            alert('É necessário estar logado para remover uma ferramenta');
          } else {
            alert(res.err);
          }
        } else {
          props.removeTool(tool.id);
        }
      });
  }

  return (
    <div className="Tool" key={tool._id}>
      <div className="toolHeader">
        <a href={tool.link} target="_blank" rel="noopener noreferrer">
          <h3 className="toolTitle">{tool.title}</h3>
        </a>
        <span className="removeBut" onClick={removeTool}>X remove</span>
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
  );
};

export default Tool;
