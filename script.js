const equationCurrent = document.getElementById("equation-current");
const equationPrev = document.getElementById("equation-prev");

const buttonNums = [...document.getElementsByClassName("num")];
buttonNums.forEach((button) => button.addEventListener("click", (e) => numClicked(e.target.innerText)));

const buttonOps = [...document.getElementsByClassName("op")];
buttonOps.forEach((button) => button.addEventListener("click", (e) => opClicked(e.target.innerText)));

const buttonDot = document.getElementById("btn-dot");
buttonDot.addEventListener("click", addDot);

const buttonDelete = document.getElementById("btn-delete");
buttonDelete.addEventListener("click", deleteClicked);

window.addEventListener("keydown", (e) => keyPressed(e.key, e));
window.addEventListener("keyup", (e) => {
  const keybutton = document.querySelector(`.button[data-key="${e.key}"]`);
  if (!keybutton) return;
  keybutton.classList.remove("keydown");
});

let clear = true,
  op_clicked = false,
  operand_prev_exists = false;

let operator_prev = "";

let operand_cur = 0,
  operand_prev = 0;

function keyPressed(key, e) {
  const keybutton = document.querySelector(`.button[data-key="${key}"]`);
  if (!keybutton) return;
  keybutton.classList.add("keydown");
  e.preventDefault();
  switch (true) {
    case key == "Enter":
      key = "=";
    case key == "+" || key == "-" || key == "/" || key == "*" || key == "^" || key == "%" || key == "=":
      opClicked(key);
      break;
    case key == "Backspace":
      deleteClicked();
      break;
    case key == "Escape":
      clearScreen(true);
      break;
    case key == ".":
      addDot();
      break;
    case key >= "0" && key <= "9":
      numClicked(key);
      break;
  }
}

function numClicked(text) {
  if (operator_prev == "=") {
    clearScreen(true);
    equationCurrent.innerText = text;
    clear = false;
  } else if (op_clicked == false) {
    if (clear == true) {
      clear = false;
      equationCurrent.innerText = text;
    } else {
      equationCurrent.innerText += text;
    }
  } else {
    op_clicked = false;
    equationCurrent.innerText = text;
  }
  return;
}

function opClicked(op) {
  operator_cur = op;
  //click multiple operators in a row (revise operator)
  if (op_clicked == true && operator_cur != "=") {
    equationPrev.innerText = operand_prev + " " + operator_cur;
  }
  //pressed equals previously
  else if (operator_prev == "=" && operator_cur != "=") {
    equationPrev.innerText = equationCurrent.innerText + " " + operator_cur;
  }
  //pressed equals default behavior
  else if (operator_prev != "=" && operator_cur == "=") {
    if (operand_prev_exists) {
      operand_cur = equationCurrent.innerText;

      operator = operator_prev;
      if (operator == "/" && operand_cur == 0) {
        op_clicked = true;
        alert("Cannot divide by Zero!");
        clearScreen(false);
        return;
      }
      equationCurrent.innerText = calculate(+operand_prev, +operand_cur, operator);
      equationPrev.innerText = operand_prev + " " + operator + " " + operand_cur + " = ";
      op_clicked = true;
      operand_prev = equationCurrent.innerText;
    }
  }
  //continuous operations
  else if (operator_prev != "=" || operator_cur != "=") {
    equationPrev.innerText = operand_prev + " " + operator_cur;
    if (operand_prev_exists) {
      equationPrev.innerText = operand_prev + " " + operator_cur;

      operand_cur = equationCurrent.innerText;
      operator = operator_prev;
      if (operator == "/" && operand_cur == 0) {
        op_clicked = true;
        alert("Cannot divide by Zero!");
        clearScreen(false);
        return;
      }
      equationCurrent.innerText = calculate(+operand_prev, +operand_cur, operator);
    }
    op_clicked = true;
    operand_prev_exists = true;
    operand_prev = equationCurrent.innerText;
    equationPrev.innerText = operand_prev + " " + operator_cur;
  }

  operator_prev = operator_cur;
  return;
}

function addDot() {
  clear = false;
  if (equationCurrent.innerText.includes(".")) {
    return;
  }
  equationCurrent.innerText += ".";
}

function deleteClicked() {
  if (equationCurrent.innerText.length > 1) {
    equationCurrent.innerText = equationCurrent.innerText.slice(0, -1);
  } else {
    equationCurrent.innerText = "0";
    clear = true;
  }
  operand_prev = equationCurrent.innerText;
}

function clearScreen(reset) {
  if (reset) {
    op_clicked = false;
    operand_prev_exists = false;
    operator_prev = "";
    operand_cur = 0;
    operand_prev = 0;
    equationCurrent.innerHTML = 0;
    equationPrev.innerText = "";
    clear = true;
  } else {
    clear = true;
  }
}

const add = function (a, b) {
  return (a * 10 + b * 10) / 10;
};

const subtract = function (a, b) {
  return (a * 10 - b * 10) / 10;
};

const multiply = function (a, b) {
  return (a * 10 * (b * 10)) / 100;
};

const divide = function (a, b) {
  return (a * 10) / (b * 10);
};

const exp = function (a, b) {
  return (a ** b * 10) / 10;
};

const mod = function (a, b) {
  return a % b;
};

const calculate = function (a, b, op) {
  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    case "^":
      return exp(a, b);
    case "%":
      return mod(a, b);
  }
};

document.addEventListener("DOMContentLoaded", clearScreen(true));
