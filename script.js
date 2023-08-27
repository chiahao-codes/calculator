window.addEventListener("load", (e) => {
  console.log("Loaded...");
  if (localStorage.getItem("previous") == null) {
    localStorage.setItem("initialZero", "true");
    localStorage.setItem("current", "0");
  }
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
    this.opRegEx = /\+\-\*\//;
  }

  validateExpr(str) {
    let result = this.opRegEx.test(str);
    return result
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    localStorage.clear();
    localStorage.setItem("initialZero", "true");
    localStorage.setItem("current", "0");
    localStorage.removeItem("previous");
    localStorage.setItem("calculated", "false");
  }

  delete() {
    let currentLocalStorage = localStorage.getItem("current");
    let previousLocalStorage = localStorage.getItem("previous");

    if (currentLocalStorage && !previousLocalStorage) {
      if (currentLocalStorage.length === 1) {
        currentLocalStorage = "0";
      } else {
         currentLocalStorage = currentLocalStorage.slice(0, -1);
        }
    }

    localStorage.setItem("current", currentLocalStorage);

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
    let currLocal,
      prevOperandText,
      toBeComputed,
      operator,
      currOperand = "",
      priorOperand = "";

    currLocal = localStorage.getItem("current");
    prevOperandText = localStorage.getItem("prevOperandText");

    toBeComputed = `${prevOperandText}${currLocal}`;
    console.log("toBeComputed", toBeComputed);

    let memo = {};

    for (let i = 0; i < toBeComputed.length; i++) {
      let char = toBeComputed[i];
  
    //if char is an operator
      if (this.validateExpr(char)) {
        //check & prepare variables for computing:
        //if no calculation to be done:
        if (!localStorage.getItem("computation") && !memo["priorOperand"]) {
          //store operator and priorOperand;
          memo["operator"] = operator;
          memo["priorOperand"] = currOperand;
       
        } else {
          //prepare for computation;
          if (localStorage.getItem("computation")) {
            priorOperand = localStorage.getItem("computation");
          } else {
            priorOperand = memo["priorOperand"];
            operator = memo["operator"];
          }
            //run computation
          this.runCalculation(priorOperand, operator, currOperand);
          memo["operator"] = char;
          memo["priorOperand"] = "";
          currOperand = "";
        }
      } else {
        //build operand;
        currOperand += char;
      }
    }

    if (localStorage.getItem("current")) {
      currOperand = localStorage.getItem("current");
      priorOperand = localStorage.getItem("computation");
      operator = memo["operator"];
      this.runCalculation(priorOperand, operator, currOperand);
    }

    localStorage.setItem("calculated", "true");

    return 
  }

  runCalculation(operand1, operation, operand2) {
    //perform math computation based on the operation button selected;
    let computation = 0;

    switch (operation) {
      case "+":
        computation = operand1 + operand2;
        break;
      case "-":
        computation = operand1 - operand2;
        break;
      case "*":
        computation = operand1 * operand2;
        break;
      case "/":
        computation = operand1 / operand2;
        break;
      default:
        return;
    }
   
    localStorage.setItem("computation", computation.toString());

    return
  }

  //updates the display screen;
  updateDisplay() {
    let regExp = /\./g;
    let curr = localStorage.getItem("current");
    let opsButton = localStorage.getItem("operationButtonPushed");
    let computed = localStorage.getItem("computation");

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

    //Only if operation button was pushed...
    if (opsButton === "true") {
      //update previousOperandText display
      this.previousOperandTextElement.innerText =
        localStorage.getItem("prevOperandText");
    }

    if (localStorage.getItem("initialZero") === "true") {
      localStorage.setItem("previous", "")
      this.previousOperandTextElement.innerText = localStorage.getItem("previous");
    }

    //update computation display if needed;
    if (computed && localStorage.getItem("calculated")) {
      curr = computed;
      localStorage.setItem("previous", "");
      this.previousOperandTextElement.innerText = localStorage.getItem("previous");
    }


    localStorage.setItem("current", curr);
    this.currentOperandTextElement.innerText = localStorage.getItem("current");

    return;
  }
}

//calculator app must run based on stored info in local storage;
const numberButtons = document.querySelectorAll("[data-number]");
//css specificity needed for more consistent performance;
const operationButtons = document.querySelectorAll("body > .calculator_grid > button.operation"); //NodeList returned;
const equalsButton = document.querySelector("body > .calculator_grid > button.equals");
const deleteButton = document.querySelector(
  "body > .calculator_grid > button.delete"
);
const allClearButton = document.querySelector(
  "body > .calculator_grid > button.all-clear");
let previousOperandTextElement = document.querySelector(
  "body > .calculator_grid > .output > .previous_operand"
);
let currentOperandTextElement = document.querySelector(
  "body > .calculator_grid > .output > .current_operand"
);

let calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem("operationButtonPushed", "false");
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let currentLS = localStorage.getItem("current");
    let previousLS = localStorage.getItem("previous");
    let operationLS = localStorage.getItem("operation");
    let previousOperandTextElementLS = localStorage.getItem("prevOperandText");
    let operationButton = button.innerText;

    if (currentLS == null || currentLS == "") {
      alert("Invalid entry");
      return
    }

    let lastChar = currentLS.charAt(currentLS.length - 1);
    if (lastChar === ".") {
      currentLS = currentLS + "0";
    }

    //collect each "current" & operation button entry;
    //build out strings in local storage;+
    if (previousOperandTextElementLS == null) previousOperandTextElementLS = "";

    if (previousLS == null) {
      previousLS = `${currentLS} `;
    } else {
      previousLS += `${currentLS} `;
    }
    previousOperandTextElementLS += currentLS;

    if (operationLS == null) {
      operationLS = `${operationButton} `;
    } else {
      operationLS += `${operationButton} `;
    }
    previousOperandTextElementLS += operationButton;

    currentLS = "";
    localStorage.setItem("previous", previousLS);
    localStorage.setItem("current", currentLS);
    localStorage.setItem("operation", operationLS);
    localStorage.setItem("prevOperandText", previousOperandTextElementLS);
    localStorage.setItem("operationButtonPushed", "true");
    localStorage.setItem("initialZero", "false");

    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  let currLS = localStorage.getItem("current");
  let prevLS = localStorage.getItem("previous");

  if (currLS == "" || prevLS == "") {
    return
  }
  console.log("equals pushed...");

 let lastChar = currLS.charAt(currLS.length - 1);
 if (lastChar === ".") {
   currLS = currLS + "0";
  }
  
  localStorage.setItem("current", currLS);
  localStorage.setItem("operationButtonPushed", "false");
 
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
     */