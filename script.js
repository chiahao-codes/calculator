window.addEventListener("load", (e) => {
  console.log("Loaded...");
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
  }
  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    localStorage.clear();
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1); //returns the string you want to keep;
    localStorage.setItem("current", this.currentOperand);
    if (!localStorage.getItem("current")) {
      localStorage.clear();
    }
  }

  //each time a user pushes a number button...
  //set a property called currentOperand equal to stringified value of the number + currentOperand;
  //calculator's screen will append each number in the order of input on the screen;
  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) {
      return;
    } else if(this.currentOperand === null) {
      this.currentOperand = "0";
      localStorage.setItem("initialZero", "true");
      localStorage.setItem("current", this.currentOperand);
    } else {
      if (localStorage.getItem("initialZero") === "true") {
        localStorage.setItem("initialZero", "false");
      }
      this.currentOperand = this.currentOperand.toString() + number.toString();
      // remove zero from display;
      this.currentOperandTextElement = this.currentOperand;
      localStorage.setItem("current", this.currentOperand);
    }
    
    return this.currentOperand;
  }

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

  //compute the mathematical expressions and display on screen;
  compute() {
    let currLocal = localStorage.getItem("current"),
      prevLocal = localStorage.getItem("previous"),
      prev,
      current,
      computation;

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
    this.currentOperand = computation; //number;
    this.operation = undefined;
    this.previousOperand = "";

    let currNumToString = this.currentOperand.toString();

    localStorage.setItem("current", currNumToString);
    localStorage.setItem("previous", this.previousOperand);
    localStorage.setItem("operation", this.operation);
  }

  //updates the display screen after other methods are ran;
  updateDisplay() {
    if (localStorage.getItem("current")) {
      this.currentOperandTextElement.innerText =
        localStorage.getItem("current");
    } else {
      
      this.currentOperandTextElement.innerText = "";
    }

    if (localStorage.getItem("previous")) {
      this.previousOperandTextElement.innerText = `${localStorage.getItem(
        "previous"
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

//calculator app must run based on stored info in local storage;
const numberButtons = document.querySelectorAll("[data-number]");
console.log(numberButtons);
const operationButtons = document.querySelectorAll("[data-operation]"); //NodeList returned;
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
    if (!currentOperandTextElement.innerText) {
      return;
    }
    calculator.chooseOperation(button.innerText);
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
