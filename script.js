window.addEventListener("load", (e) => {
  console.log("Loaded...");
  localStorage.setItem("initialZero", "true");
  localStorage.setItem("current", "0");
  calculator.updateDisplay();
});

//Calculator class stores number input, handles display of output;
class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    //sets textElement property values inside the Calculator class;
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.currentOperand = localStorage.getItem("current");
    this.previousOperand = localStorage.getItem("previous");
    this.operation = localStorage.getItem("operation");
    this.calculated = localStorage.getItem("calculated");
  }
  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    localStorage.clear();
    localStorage.setItem("initialZero", "true");
    localStorage.setItem("current", "0");
    localStorage.setItem("calculated", "false");
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1); //returns the string you want to keep;
    localStorage.setItem("current", this.currentOperand);
    if (!localStorage.getItem("current")) {
      localStorage.clear();
      localStorage.setItem("initialZero", "true");
      localStorage.setItem("current", "0");
    }
  }

  appendNumber(number) {
    //add input to current local storage;
    let currentLS = localStorage.getItem("current");
    currentLS += number.toString();
    localStorage.setItem("current", currentLS); // resets/sets new current number;

    return;
  }
  

  //compute the mathematical expressions and display on screen;
  compute() {
    let currLocal, prevLocal, prev, current, computation;

    currLocal = localStorage.getItem("current");
    prevLocal = localStorage.getItem("previous");

    //convert strings to numbers;
    prev = parseFloat(prevLocal);
    current = parseFloat(currLocal);

    //checks if there is a number to compute inside previous or current operand;
    if (isNaN(prev) || isNaN(current)) {
      return;
    }

    //perform math computation based on the operation button selected;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      default:
        return;
    }

    //Note: Build a separate function for ongoing computation display;

    this.currentOperand = computation; //number;
    this.operation = undefined;
    this.previousOperand = "";
    this.calculated = "true";

    let currNumToString = this.currentOperand.toString();

    localStorage.setItem("current", currNumToString);
    localStorage.setItem("previous", this.previousOperand);
    localStorage.setItem("operation", this.operation);
    localStorage.setItem("calculated", this.calculated);

    return;
  }

  //updates the display screen;
  updateDisplay() {
    let regExp = /\./g;
    let curr = localStorage.getItem("current");
    let prev = localStorage.getItem("previous");
    let operations = localStorage.getItem("operation");

    //remove initial zero;
    if (curr.length > 1) {
      if (localStorage.getItem("initialZero") && curr[0] === "0") {
        localStorage.setItem("initialZero", "false");
        curr = curr.slice(1);
      }
      //remove consecutive initial zeros
      if (curr[0] === "0" && curr[1] === "0") {
        curr = "0";
      }
    }

    //if more than one decimal, remove previous decimal from curr;
    let decimalsArray = curr.match(regExp);
    if (decimalsArray) {
      if (decimalsArray.length > 1) {
        curr = curr.slice(0, -1);
      }
    }

    localStorage.setItem("current", curr);
    this.currentOperandTextElement.innerText = localStorage.getItem("current");

    //turn strings to array;
    if (prev) {
      let prevArr = prev.split(" ");
      console.log("previous:", prevArr);

       let opsArr = operations.split(" ");
       console.log("operations:", opsArr);

      //iterate through previous and operations storage;
      for (let i = 0; i < prevArr.length; i++) {
        for (let j = 0; j < opsArr.length; j++) {
          let pr = prevArr[i];
          let ops = opsArr[j];
          if(pr !== "" && ops !== "")
          this.previousOperandTextElement.innerText = `${pr} ${ops}`;
        }
      }
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

//calculator app must run based on stored info in local storage;
const numberButtons = document.querySelectorAll("[data-number]");
//css specificity needed for more consistent performance;
const operationButtons = document.querySelectorAll("body > .calculator_grid > button.operation"); //NodeList returned;
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
let previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
let currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

let calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let currentLS = localStorage.getItem("current");
    let previousLS = localStorage.getItem("previous");
    let operationLS = localStorage.getItem("operation");
    let operationButton = button.innerText;

    if (currentLS === "") {
      return;
    }

    //collect each "current" & operation button entry;
    //build out strings in local storage;+
    if (previousLS == null) {
      previousLS = `${currentLS} `;
    } else {
      previousLS += `${currentLS} `;
    }
    
    if (operationLS == null) {
      operationLS = `${operationButton} `;
    } else {
      operationLS += `${operationButton} `;
    }
    
    currentLS = "";
    localStorage.setItem("previous", previousLS);
    localStorage.setItem("current", currentLS);
    localStorage.setItem("operation", operationLS);

    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});


/**
    chooseOperation(operation) {
    if (this.currentOperand === "") {
      return;
    }
    if (this.previousOperand !== "") {
      this.compute();
    }
    
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";

    localStorage.setItem("previous", this.previousOperand);
    localStorage.setItem("current", this.currentOperand);
    localStorage.setItem("operation", this.operation);
  }
 */