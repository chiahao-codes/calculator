//Calculator class stores number input, handles display of output;
class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    //sets textElement property values inside the Calculator class;
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear(); //clears data each time a new calculator is created;
  }
  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  //each time a user pushes a number button...
  //set a property called currentOperand equal to stringified value of the number + currentOperand;
  //calculator's screen will append each number in the order of input on the screen;
  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) {
      return;
    }
      this.currentOperand = this.currentOperand.toString() + number.toString();
      return this.currentOperand;
  }

  //set operation property to inputted operation button text;
  //set previous operand to current operand; moves the number/operation input to upper screen;
  //clear up current operand;
  chooseOperation(operation) {
    
    if (loaded) {
     let curr = localStorage.getItem("current");
      let previ = localStorage.getItem("previous");
      this.currentOperand = curr;
      this.previousOperand = previ;
    }

    if (this.currentOperand === "") {
      return;
    } //prevents further execution of function if current operand innerText is empty to begin with;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation; //if this.previousOperand === "", then it skips compute() and sets operation value;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  //compute the mathematical expressions and display on screen;
  compute() {
    let computation;
    //convert strings to numbers;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

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
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  //converts number to string with commas in display;
  getDisplay(number) {
    const stringNumber = number.toString(); //convert number into string, so we can split it up by where the decimal is;

    const integerDigits = parseFloat(stringNumber.split(".")[0]); //get the integer, before the decimal;
    
    const decimalDigits = stringNumber.split(".")[1]; //get the numbers...aka substring, after the decimal;
      
      let integerDisplay;
      if (isNaN(integerDigits)) {
        //if user only inputs a decimal point;
        integerDisplay = "";
      } else {
        integerDisplay = integerDigits.toLocaleString("en", {
          maximumFractionDigits: 0,
        });
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
      } else {
        return integerDisplay;
      }
  }
  //updates the display screen after other methods are ran;
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplay(
      this.currentOperand
    );
    localStorage.setItem("current", this.currentOperandTextElement.innerText);
    if (this.operation) {
        this.previousOperandTextElement.innerText =
        `${this.getDisplay(this.previousOperand)} ${this.operation}`;
      localStorage.setItem(
        "previous",
        this.previousOperandTextElement.innerText
      );
      
    } else {
        this.previousOperandTextElement.innerText = "";
    }
  }
}


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

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

//each time a user clicks a number-button, update the screen;
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
       let prevStorage = localStorage.getItem("previous");
       if (prevStorage) {
         localStorage.setItem("previous", "");
       }
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
   let prev = localStorage.getItem("previous");
   if (prev) {
     localStorage.setItem("previous", "");
   }
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
   let prev = localStorage.getItem("previous");
   if (prev) {
     localStorage.setItem("previous", "");
   }
});

let loaded;
window.addEventListener("load", (e) => {
  console.log("Loaded...");

  let currently = localStorage.getItem("current");
  let previously = localStorage.getItem("previous");

  if (currently) {
    document.querySelector("[data-current-operand]").innerText = currently;
  }

  if (previously) {
    document.querySelector("[data-previous-operand]").innerText = previously;
  }

  loaded = true;
});
 