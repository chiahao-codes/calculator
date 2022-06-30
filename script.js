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
    }
    this.currentOperand = this.currentOperand.toString() + number.toString();
    localStorage.setItem("current", this.currentOperand);
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
  }

  //compute the mathematical expressions and display on screen;
  compute() {
    let currLocal = localStorage.getItem("current"),
      prevLocal = localStorage.getItem("previous"),
      prev,
      current,
      computation;

    //convert strings to numbers;
    if (currLocal && prevLocal) {
      prev = parseFloat(prevLocal);
      current = parseFloat(currLocal);
    } else {
      prev = parseFloat(this.previousOperand);
      current = parseFloat(this.currentOperand);
    }

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
  }

  //converts number to string with commas in display;
  /**
   *   getDisplay(number) {
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
   */

  //updates the display screen after other methods are ran;
  updateDisplay() {
    if (localStorage.getItem("current")) {
      this.currentOperandTextElement.innerText = localStorage.getItem("current");
    } else {
      this.currentOperandTextElement.innerText = "";
    }
      
    /**
     * = this.getDisplay(
      this.currentOperand
    );
    `${this.getDisplay(
        this.previousOperand
      )} ${this.operation}`;
     */

    if (localStorage.getItem("previous")) {
      this.previousOperandTextElement.innerText =
        localStorage.getItem("previous");
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

window.addEventListener("load", (e) => {
  console.log("Loaded...");
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
  });

  allClearButton.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
  });

  deleteButton.addEventListener("click", () => {
    calculator.delete();
    calculator.updateDisplay();
  });
});
 