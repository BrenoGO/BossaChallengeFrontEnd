import React, { Component } from 'react';
import './addModal.css';
import { ToolsService } from '../services/ToolsService';

export default class components extends Component {
  constructor(props){
    super(props);
    this.state = {
      title: '',
      link: '',
      description: '',
      tags: ''
    }
    this.handleCloseBut = this.handleCloseBut.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleCloseBut(){
    this.props.changeFunction();
  }
  handleChange(event){
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }
  async handleSubmit(event){
    console.log('entrou no handleSubmit');
    const { state } = this;
    event.preventDefault();
    const tags = state.tags.split(/\s+/);
    if(state.title && state.description && state.link){
      const tool = await ToolsService.create({...state, tags });
      console.log('tool:', tool);
      if(tool.err){
        alert(tool.err);
      }else{
        this.props.addTool(tool);
        this.setState({
          title: '',
          link: '',
          description: '',
          tags: ''
        });
      }
    }else{
      alert('Preencha todos os campos obrigatórios');
    }
  }
  render() {
    const { state } = this;
    return (
    <div>
      <div id="backDrop"></div>
      <div id="addModal">
        <div id="headerModal">
          <h1 id="modalTitle">+ Add new tool</h1>
          <span id="closeModalBut" onClick={this.handleCloseBut}>X</span>
        </div>
        <form id="addToolForm" onSubmit={this.handleSubmit}>
        <label className="labels">
          <span>Tool Name * </span>
          <input type="text" className="addFormInput" onChange={this.handleChange} name="title" value={state.title}/>
        </label>
        <label className="labels">
          <span>Tool Link *</span>
          <input type="text" className="addFormInput" onChange={this.handleChange} name="link" value={state.link}/>
        </label>
        <label className="labels">
          <span>Tool Description *</span>
          <textarea rows="4" className="addFormInput" onChange={this.handleChange} name="description" value={state.description} />
        </label>
        <label className="labels">
          <span>Tags</span>
          <input type="text" className="addFormInput" onChange={this.handleChange} name="tags" value={state.tags}/>
        </label>
        <div id="divAddBut">
          <button type="submit" id="submitAddBut">Add tool</button>
        </div>
        </form>
      </div>
    </div>
    );
  }
}
