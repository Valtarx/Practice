import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component{
  state = {
    task:{
      taskType:'translations',
      source:  'https://wooordhunt.ru',
      word:    ''
    },
    sources:["https://wooordhunt.ru", "https://dictionary.cambridge.org"],
    // translations:[],
    // definitions:[],
    // examples:[]
    data:[]
  }
  sendTask = _ => {
    fetch('http://localhost:4000/'+this.state.task.taskType+'?source='+
    this.state.task.source+'&word='+this.state.task.word).then(response =>response.json())
    .then(response => 
      {
        if(this.state.task.taskType=="translations"){
          this.setState({data:response.data});
          console.log(this.state.data);
        }
        else{
          this.setState({data:response.data})
          console.log(response);
        }
        //console.log(this.state.data);
      });
      console.log("Okey");
    }
      
    // alert('http://localhost:4000/'+this.state.task.taskType+'?source='+
    // this.state.task.source+'&word='+this.state.task.word);
    
  
  addSite     = (val) => <option  value={val}>{val}</option>

  fillData = data => {if (this.state.task.taskType=="translations"){
    return <div>{data}</div>
  }
else{
  return<div>
    <h2>{data.definition}</h2>
    <ul>
      {data.examples.map(this.fillExamp)}
    </ul>
  </div>
  
}}
fillExamp = examp => <li>{examp}</li>

  
  render(){
    const translationSources = ["https://wooordhunt.ru", "https://dictionary.cambridge.org"];
    const definitionSources  = ["https://www.lexico.com","https://dictionary.cambridge.org"];
    const taskTypes          = ["translations","definitions"];
    const {task,sources,data} = this.state;
    return (
      <div>
        <input value={task.word} onChange={e => {this.setState({task:{...task,word:e.target.value}})}}></input>

        <button onClick={this.sendTask}>Найти</button>

        <select id="taskType" name="taskType" value={task.taskType} onChange={e => {
          if(e.target.value==taskTypes[0]){
            this.setState({sources:translationSources});
            this.setState({task:{taskType:e.target.value,source:translationSources[0],word:task.word}})
          }
          else{
            this.setState({sources:definitionSources});
            this.setState({task:{taskType:e.target.value,source:definitionSources[0],word:task.word}})
          }
          }}>
          <option value={taskTypes[0]}>Переводы</option>
          <option value={taskTypes[1]}>Дефиниции и примеры</option>
        </select>

        <select id="source" name="source" value={task.source} onChange={e =>{
          this.setState({task:{...task,source:e.target.value}})
        }}>
          {sources.map(this.addSite)}
        </select>
        <div value={data}>{this.state.data.map(this.fillData)}</div>
      </div>
    );
  }
}

export default App;
