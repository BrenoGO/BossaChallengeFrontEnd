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
    if (tags[tags.length - 1] === '') tags.pop();
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
      <div className="backDrop" />
      <div id="addModal">
        <div id="headerModal">
          <h1 id="modalTitle">+ Add new tool</h1>
          <span id="closeModalBut" onClick={handleCloseBut}>X</span>
        </div>
        <form id="addToolForm" onSubmit={handleSubmit}>
          <label>Tool Name *</label>
          <input type="text" className="addFormInput" onChange={handleChange} name="title" value={inputs.title} />
          <label>Tool Link *</label>
          <input type="text" className="addFormInput" onChange={handleChange} name="link" value={inputs.link} />
          <label>Tool Description *</label>
          <textarea rows="4" className="addFormInput" onChange={handleChange} name="description" value={inputs.description} />
          <label>Tags</label>
          <input type="text" className="addFormInput" onChange={handleChange} name="tags" value={inputs.tags} />
          <button type="submit" className="but-primary-neutral" id="submitAddBut">Add tool</button>
        </form>
      </div>
    </div>
  );
}
