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
    if (number === "." && this.currentOperand.includes(".")) {
      return;
    }

    //if no existing computation is going on, but previous calculation is still displayed
    if (
      localStorage.getItem("calculated") === "true" &&
      localStorage.getItem("previous") === ""
    ) {
      //clear display if there is a preexisting calculation result shown;

      localStorage.setItem("calculated", "false");
      this.calculated = localStorage.getItem("calculated");
      this.currentOperand = "";
    }

    //if starting with 0 in the current display;
    if (localStorage.getItem("initialZero") === "true") {
      localStorage.setItem("initialZero", "false");
      localStorage.setItem("current", number.toString()); // set new current number;
      this.currentOperand = localStorage.getItem("current");
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

  stillCalculating(latestEntry) {

    //update display && keep track of calculation;
    let latestEntryString = latestEntry.toString();
    if (localStorage.getItem("previous") && localStorage.getItem("operation") && localStorage.getItem("calculated")) {
      //calculate latest entry and store inside local storage:
      

      this.previousOperandTextElement.innerText =`${localStorage.getItem("previous")} ${this.operation} ${latestEntryString}`
    }
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
    return;
  }
}

//calculator app must run based on stored info in local storage;
const numberButtons = document.querySelectorAll("[data-number]");
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
