import React from 'react';
import './App.css';
import { ApiService } from './services/ApiService';
import { ToolsService } from './services/ToolsService';

import AddModal from './components/AddModal';
import Tool from './components/Tool';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tools: [],
      name: '',
      password: '',
      boolAddModal: false,
      logged: false,
      searchedTag: '',
      boolCheckSearchTag: false
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.changeBoolAddModal = this.changeBoolAddModal.bind(this);
    this.addTool = this.addTool.bind(this);
    this.removeTool = this.removeTool.bind(this);
  }
  async componentWillMount(){
    const tools = await ToolsService.list();
    const logged = localStorage.getItem('token@bossabox') ? true : false;
    const name = localStorage.getItem('name@bossabox') ? localStorage.getItem('name@bossabox') : '';
    this.setState({tools, logged, name});
  }
  async handleLogin(event){
    event.preventDefault();
    const { name, password } = this.state;
    const resp = await ApiService.login({name, password});
    if(resp.err){
      alert(resp.err);
      this.setState({name: '', password:''});
    }else{
      localStorage.setItem('token@bossabox', resp.token);
      localStorage.setItem('name@bossabox', name);
      this.setState({logged: true, password: ''});
    }
  }
  handleChange(event){
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }
  async handleSearchChange(event){
    const { name, value } = event.target;
    let boolCheckSearchTag = this.state.boolCheckSearchTag;
    let tools = [];
    if(name === 'searchedTag'){
      this.setState({searchedTag: value});
      if(value === ''){
        tools = await ToolsService.list();
        boolCheckSearchTag = false;
      }else{
        tools = await ToolsService.searchTag(value);
        boolCheckSearchTag = true;
      }
      return this.setState({tools, boolCheckSearchTag})
    }//name === 'checkSearchTag'
    boolCheckSearchTag = !boolCheckSearchTag;
    if(!boolCheckSearchTag){
      tools = await ToolsService.list();
    }else{//were false, became true
      if(this.state.searchedTag){
        tools = await ToolsService.searchTag(this.state.searchedTag);
      }
    }
    return this.setState({tools, boolCheckSearchTag});
  }
  changeBoolAddModal(){
    this.setState(state => {
      return {
        boolAddModal: !state.boolAddModal
      }
    })
  }
  addTool(tool){
    this.setState(state => {
      return {
        tools: [...state.tools, tool],
        boolAddModal: false
      }
    })
  }
  removeTool(toolId){
    const { tools } = this.state;
    const toolIndex = tools.findIndex(tool => tool.id === toolId);
    
    tools.splice(toolIndex, 1);
    this.setState({tools});
  }
  showModal(){
    if(this.state.boolAddModal){
      return (
        <AddModal changeFunction={this.changeBoolAddModal} addTool={this.addTool}/>
      );
    }
  }
  loginArea(){
    if(!this.state.logged){
      return (
        <form id="login" onSubmit={this.handleLogin}>
          <label className="labelLogin">
            Name:
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
          </label>
          <label className="labelLogin">
            Password:
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
          </label>
          <button type="submit">Login</button>
        </form>
      )
    }
    return (
        <p>Welcome {this.state.name}</p>
    )
  }
  render(){
    const { state } = this;
    return (
    <div className="App">
      <div id="header">
        <div id="titles">
          <h1 onClick={() => this.addTool2()}>VUTTR</h1>
          <h2>Very Useful Tools To Remember</h2>
        </div>
        <div id="rightHead">
          {this.loginArea()}
        </div>
      </div>
      <div id="subHead">
        <div id="divInputTag">
          <input type="text" name="searchedTag" onChange={this.handleSearchChange} value={state.searchedTag}/>
          <input type="checkbox" name="checkSearchTag" onChange={this.handleSearchChange} checked={state.boolCheckSearchTag} />
        </div>
        <div id="divButAdd">
          <button id="addBut" onClick={this.changeBoolAddModal}><span id="addSymbol">+</span> Add</button>
        </div>
      </div>
      <div>
        {this.showModal()}
        <div id="list">
          {
            this.state.tools.map(tool => <Tool key={tool._id} tool={tool} removeTool={this.removeTool} searchedTag={state.searchedTag}/>)
          }
        </div>
      </div>
    </div>
    );
  }
}

export default App;
