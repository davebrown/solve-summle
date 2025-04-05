// cribbed from here: https://gist.github.com/mvladic/9b2f2025a8c54aca78649ce1776600b6

const op = [['+', (a, b) => a + b], ['-', (a, b) => a - b], ['*', (a, b) => a * b], ['/', (a, b) => a / b]];

let bestSolution;

let target = 0;
let inputs = [];


onmessage = function(event) {
  target = event.data.target;
  inputs = event.data.inputs;
  //console.log("worker invoked: target=" + target + " inputs=" + inputs);
  solve(target, inputs, []);
  var returnValue = ["DID NOT SOLVE"];
  if (bestSolution) {
    returnValue = bestSolution;
  }
  postMessage(returnValue);
};

function solve(target, nums, solution) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (j !== i) {
        for (let k = 0; k < op.length; k++) {
          const res = op[k][1](nums[i], nums[j]);
          if (res <= 0) break;
          if (Number.isInteger(res)) {
            const newSolution = [...solution, `${nums[i]} ${op[k][0]} ${nums[j]} = ${res}`];
            if (res === target) {
              if (/*true*/!bestSolution || newSolution.length < bestSolution.length) {
                bestSolution = newSolution;
                console.log(newSolution);
              }
            } else {
              if (newSolution.length < 5) {
                const newNums = nums.slice();
                newNums.splice(i, 1);
                newNums.splice(j - (i < j ? 1 : 0), 1);
                newNums.push(res);
                solve(target, newNums, newSolution);
              }
            }
          }
        }
      }
    }
  }
};
