import React, { useState } from 'react';
import './addModal.css';
import { ToolsService } from '../services/ToolsService';

export default function AddModal(props) {
  const [inputs, setInputs] = useState({
    title: '',
    link: '',
    description: '',
    tags: ''
  });

  function handleCloseBut() {
    props.changeFunction();
  }
  function handleChange(event) {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const tags = inputs.tags.split(/\s+/);
    if (inputs.title && inputs.description && inputs.link) {
      const tool = await ToolsService.create({ ...inputs, tags });
      if (tool.err) {
        if (tool.err.toString().match(/authorized/i)) {
          alert('É necessário estar logado para inserir nova ferramenta');
        } else {
          alert(tool.err);
        }
      } else {
        props.addTool(tool);
        setInputs({
          title: '',
          link: '',
          description: '',
          tags: ''
        });
      }
    } else {
      alert('Preencha todos os campos obrigatórios');
    }
  }
  return (
    <div>
      <div id="backDrop" />
      <div id="addModal">
        <div id="headerModal">
          <h1 id="modalTitle">+ Add new tool</h1>
          <span id="closeModalBut" onClick={handleCloseBut}>X</span>
        </div>
        <form id="addToolForm" onSubmit={handleSubmit}>
          <label className="labels">
            <span>Tool Name * </span>
            <input type="text" className="addFormInput" onChange={handleChange} name="title" value={inputs.title} />
          </label>
          <label className="labels">
            <span>Tool Link *</span>
            <input type="text" className="addFormInput" onChange={handleChange} name="link" value={inputs.link} />
          </label>
          <label className="labels">
            <span>Tool Description *</span>
            <textarea rows="4" className="addFormInput" onChange={handleChange} name="description" value={inputs.description} />
          </label>
          <label className="labels">
            <span>Tags</span>
            <input type="text" className="addFormInput" onChange={handleChange} name="tags" value={inputs.tags} />
          </label>
          <div id="divAddBut">
            <button type="submit" id="submitAddBut">Add tool</button>
          </div>
        </form>
      </div>
    </div>
  );
}
