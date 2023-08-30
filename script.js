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
    localStorage.setItem("cleared", "true");
  }

  delete() {
    let currentLocalStorage = localStorage.getItem("current");
    let prevOpText = localStorage.getItem("prevOperandText");

    if (currentLocalStorage) {
      if (currentLocalStorage.length === 1) {
        localStorage.setItem("initialZero", "true");
        localStorage.setItem("current", "0");
        currentLocalStorage = localStorage.getItem("current");
      } else {
        currentLocalStorage = currentLocalStorage.slice(0, -1);
      }
    }

    if (!currentLocalStorage && prevOpText) {
      prevOpText = prevOpText.slice(0, -1);
      localStorage.setItem("prevOperandText", prevOpText);
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
    console.log("tobeComputed:", toBeComputed);
    // Equals button pushed...
    //3+2 = 6
    let memo = {};
    let computation = 0;

    //use Iterative approach instead of for-loop;
    //iterate over each index, computation updated along the way;
    let operand = "";
    for (let i = 0; i < toBeComputed.length; i++) { 
      let elem = toBeComputed[i];
      console.log("elem:", elem);
      //66.2564+.025 + .015 
      if (regExp.test(elem) || i === toBeComputed.length-1) {
        if (i === toBeComputed.length - 1) {
          operand += elem;
        }
          if (memo["priorOperand"] && memo["operator"]) {
            memo["currentOperand"] = operand;
          }

        if (!memo["priorOperand"]) {
          memo["priorOperand"] = operand;
        }

        if (!memo["operator"]) {
          memo["operator"] = elem;
        }

        operand = "";

      } else {
      //gather element;
        operand += elem;
      }

      if (memo["priorOperand"] && memo["currentOperand"] && memo["operator"]) {
        //run calculation;
        operator = memo["operator"];
        priorOperand = parseFloat(memo["priorOperand"]);
        currOperand = parseFloat(memo["currentOperand"]);

        console.log(priorOperand, currOperand);

        computation = this.runCalculation(priorOperand, operator, currOperand);
        memo["priorOperand"] = computation;
        memo["currentOperand"] = "";
        memo["operator"] = elem;
        operator = ""; 
        priorOperand = "";
        currOperand = "";
      }
     
    }


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

    return computation.toString();
  }

  //updates the display screen;
  updateDisplay() {
    let regExp = /\./g;
    let curr = localStorage.getItem("current");
    let opsButton = localStorage.getItem("operationButtonPushed");

    if (localStorage.getItem("cleared")) {
      this.currentOperandTextElement.innerText =
        localStorage.getItem("current");
      this.previousOperandTextElement.innerText = "";
    }

    //update computation display if needed;
    if (localStorage.getItem("prevOperandText")) {
      this.previousOperandTextElement.innerText =
        localStorage.getItem("prevOperandText");
    }

    //remove initial zero;
    if (curr.length > 1) {
      if (localStorage.getItem("initialZero") && curr[0] === "0") {
        localStorage.setItem("initialZero", "false");
        curr = curr.slice(1);
        console.log("running...");
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
      curr = "";
    }

    if (curr[0] === ".") {
      let zero = "0";
      curr = `${zero}${curr}`;
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


    //if a calculation exists on display and a decimal point is entered,
    //display is refreshed with just decimal point;
    if (button.innerText === ".") {
      if (localStorage.getItem("calculated") === "true") {
        localStorage.setItem("current", "");
      }
    }

    //get rid of initial zero in local storage;
    if (localStorage.getItem("initialZero")) {
      if (localStorage.getItem("current") === "0") {
        localStorage.setItem("current", "");
      }
    }

   // localStorage.setItem("initialZero", "false");
    localStorage.setItem("cleared", "false");
    localStorage.setItem("operationButtonPushed", "false");
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let currentLS = localStorage.getItem("current");
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

    if (previousOperandTextElementLS == null) previousOperandTextElementLS = "";

    //continue math operation:
    if (!previousOperandTextElementLS && localStorage.getItem("calculated") && currentLS) {
      localStorage.setItem("calculated", "false");
    }

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
