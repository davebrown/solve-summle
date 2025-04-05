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
      numbersInput: "", // Raw input string for the numbers field
      solution: null,
      valid: false
    };
    myWorker.onmessage = function(event) {
      this.setResult(event.data);
    }.bind(this);
  }

  setResult(result) {
    var { target, inputs } = this.state;
    //console.log("setResult(" + result + ")");
    this.setState({
      target: target,
      inputs: inputs,
      solution: result
    });
    //myWorker.terminate();
  }
  runSolve() {
    //console.log("solve clicked: target=" + this.state.target + ", inputs=" + this.state.inputs);
    myWorker.postMessage(this.state);
  }

  
  handleChange(event) {
    const { id, value } = event.target;
    let { target, inputs, solution } = this.state;

    if (id === "target") {
      const parsedValue = parseInt(value);
      target = isNaN(parsedValue) ? '' : parsedValue;
    } else if (id === "numbers") {
      // Update the raw input string
      this.setState({ numbersInput: value });

      // Process the input string into an array of numbers
      inputs = value.split(/[\s,]+/).filter(Boolean).map(Number);
    }

    this.setState({
      target,
      inputs,
      solution
    });
  }

  render() {
    const { target, inputs, solution, numbersInput } = this.state;
    const valid = Number.isInteger(target) && inputs.length === 6 && inputs.every(Number.isInteger);

    return (
      <div className="App">
        <header className="App-header">
          target: <input id="target" value={isNaN(target) ? '' : target} onChange={this.handleChange} />
          numbers: <input id="numbers" value={numbersInput} onChange={this.handleChange} />
          <button id="solve" onClick={this.runSolve} disabled={!valid}>Solve</button>
          Target: {target}<br /> Inputs: {inputs.join(",")}<br />
          {solution && (
            <div className="solution-container">
              Solution:
              {solution.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
