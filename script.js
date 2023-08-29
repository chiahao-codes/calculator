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

    const regExp = /\+|-|\*|\//;

    currLocal = localStorage.getItem("current");
    prevOperandText = localStorage.getItem("prevOperandText");

    toBeComputed = `${prevOperandText}${currLocal}`;
    console.log("toBeComputed", toBeComputed);

    let memo = {};
    for (let i = 0; i < toBeComputed.length; i++) {
      let char = toBeComputed[i];
      //if char is an operator
      if (regExp.test(char)) {
        if (!memo["priorOperand"]) {
          //if initial computation
          priorOperand = currOperand;
          memo["operator"] = char;
      } else {
            //if (initial) ongoing math expression:
            priorOperand = memo["priorOperand"];
            operator = memo["operator"];
        }
        if (!currOperand) currOperand = localStorage.getItem("current");
        
          priorOperand = parseFloat(priorOperand);
          currOperand = parseFloat(currOperand); 
        this.runCalculation(priorOperand, operator, currOperand);
        memo["priorOperand"] = localStorage.getItem("computation");
        memo["operator"] = "";
        priorOperand = "";
        currOperand = "";
        operator = "";
      } 
      else {
        //build operand;
        currOperand += char;
      }
    }

    console.log(localStorage.getItem("computation"));
    localStorage.setItem("current", localStorage.getItem("computation"));
    localStorage.setItem("prevOperandText", "");
    localStorage.setItem("calculated", true);
    return;
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

    return;
  }

  //updates the display screen;
  updateDisplay() {
    let regExp = /\./g;
    let curr = localStorage.getItem("current");
    let opsButton = localStorage.getItem("operationButtonPushed");
    let computed = localStorage.getItem("computation");

    //update computation display if needed;
    if (localStorage.getItem("calculated")) {
      curr = computed;
      this.previousOperandTextElement.innerText = localStorage.getItem("prevOperandText");
      console.log("running...")
    } else {
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
          this.previousOperandTextElement.innerText = "";
        }
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
    // let previousLS = localStorage.getItem("previous");
    // let operationLS = localStorage.getItem("operation");
    let previousOperandTextElementLS = localStorage.getItem("prevOperandText");
    let operationButton = button.innerText;

    if (currentLS == null || currentLS == "") {
      alert("Invalid entry");
      return;
    }

    let lastChar = currentLS.charAt(currentLS.length - 1);
    if (lastChar === ".") {
      currentLS = currentLS + "0";
    }

    //collect each "current" & operation button entry;
    //build out strings in local storage;+
    if (previousOperandTextElementLS == null) previousOperandTextElementLS = "";

    previousOperandTextElementLS += currentLS;
    previousOperandTextElementLS += operationButton;

    currentLS = "";

    localStorage.setItem("current", currentLS);

    localStorage.setItem("prevOperandText", previousOperandTextElementLS);
    localStorage.setItem("operationButtonPushed", "true");
    localStorage.setItem("initialZero", "false");

    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  let currLS = localStorage.getItem("current");

  if (currLS == "") {
    return
  }

 let lastChar = currLS.charAt(currLS.length - 1);
 if (lastChar === ".") {
   currLS = currLS + "0";
   localStorage.setItem("current", currLS);
  }
  
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
  *  //if char is the final index, run calculation;
        if (i === toBeComputed.length - 1) {
            priorOperand = memo[priorOperandCounter];
            operator = memo["operator"];
            currOperand = localStorage.getItem("current");
          
             priorOperand = parseFloat(priorOperand);
            currOperand = parseFloat(currOperand); 
          this.runCalculation(priorOperand, operator, currOperand);
          
          
        }
  * else {
          //bundle computation for longer math expression;
          //prepare for computation;
          priorOperand = localStorage.getItem("computation");
          operator = memo["operator"];
          currOperand = localStorage.getItem("current");
          //run computation
          priorOperand = parseFloat(priorOperand);
          currOperand = parseFloat(currOperand); 

          this.runCalculation(priorOperand, operator, currOperand);
          memo["operator"] = char;
          memo["priorOperand"] = localStorage.getItem("computation");
          currOperand = "";
          priorOperand = "";
        }
  * 
  *  //if prior Operand exists
          if (memo[counter - 1] !== undefined) {
            //run computation
            priorOperand = parseFloat(memo[counter - 1]);
            currOperand = parseFloat(memo[counter]);
            operator = memo["operator"];
            this.runCalculation(priorOperand, operator, currOperand);
          }
  *   
     */