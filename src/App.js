import React from 'react';
import './App.css';

const myWorker = new Worker(new URL('./worker.js', import.meta.url));
const isInt = Number.isInteger;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.runSolve = this.runSolve.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setResult.bind(this);
    this.state = {
      target: '',
      inputs: [],
      solution:  "NA",
      valid: false
    };
    myWorker.onmessage = function(event) {
      this.setResult(event.data);
    }.bind(this);
  }

  setResult(result) {
    var { target, inputs } = this.state;
    console.log("setResult(" + result + ")");
    this.setState({
      target: target,
      inputs: inputs,
      solution: result
    });
    //myWorker.terminate();
  }
  runSolve() {
    console.log("solve clicked: target=" + this.state.target + ", inputs=" + this.state.inputs);
    myWorker.postMessage(this.state);
  }

  
  handleChange(event) {
    var { target, inputs, solution } = this.state;
    const id = event.target.id;
    console.log("handleChange: " + id + "->'" + event.target.value + '\'');
    if (id === "target") {
      var value = parseInt(event.target.value);
      if (isNaN(value)) {
        value = '';
      }
      target = value;
    } else if (id === "numbers") {
      inputs = event.target.value.split(/[\s,]+/).filter(Boolean).map(Number);
      console.log('inputs changed ' + inputs);
    }
    this.setState({
      target: target,
      inputs: inputs,
      solution: solution
    });
  }

  render() {
    const { target, inputs, solution } = this.state;
    const valid = Number.isInteger(target) && inputs.length === 6 && inputs.every(Number.isInteger);
    return (
      <div className="App">
        <header className="App-header">
          target: <input id="target" value={isNaN(target) ? '' : target} onChange={this.handleChange}/>
          numbers: <input id="numbers" onChange={this.handleChange}/>
          <button id="solve" onClick={this.runSolve} disabled={!valid}>Solve</button>
          Target: {target}<br/> Inputs: {inputs.join(",")}<br/>
      Solution: {solution}
        </header>
      </div>
    );
  }
}

export default App;
