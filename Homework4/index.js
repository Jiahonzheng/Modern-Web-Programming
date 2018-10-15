class Calculator {
  constructor() {
    this.DOMDisplay = null;
    this.state = {
      keyType: "",
      keyValue: "",
      expression: "0"
    };
    this.init = this.init.bind(this);
    this.onClick = this.onClick.bind(this);

    window.onload = this.init;
  }

  init() {
    this.DOMDisplay = document.querySelector(".calculator-display");
    document
      .querySelector(".calculator-keys")
      .addEventListener("click", this.onClick);
  }

  onClick(e) {
    if (!e.target.matches("button")) {
      return;
    }

    this.setState({
      ...this.getKeyInfo(e.target)
    });
    this.DOMDisplay.textContent = this.createDisplayString();
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
  }

  getKeyInfo(key) {
    const { value } = key.dataset;

    if (["delete", "clear", "calculate"].includes(value)) {
      return { keyType: value };
    }

    if (value === ".") {
      return { keyType: "decimal", keyValue: value };
    }

    if (isNaN(value)) {
      return { keyType: "operator", keyValue: value };
    }

    return { keyType: "number", keyValue: value };
  }

  createDisplayString() {
    const { keyType, keyValue, expression } = this.state;
    let newExpression = expression;

    if (keyType === "delete") {
      newExpression = expression.slice(0, expression.length - 1);
      newExpression = newExpression ? newExpression : "0";
    }

    if (keyType === "clear") {
      newExpression = "0";
    }

    if (keyType === "calculate") {
      newExpression = this.calculate(expression);
    }

    if (keyType === "number") {
      if (
        expression.length !== 1 ||
        expression[0] !== "0" ||
        keyValue !== "0"
      ) {
        newExpression = (expression === "0" ? "" : expression) + keyValue;
      }
    }

    if (keyType === "operator" || keyType === "decimal") {
      const last = expression[expression.length - 1];

      if (["(", ")"].includes(keyValue)) {
        newExpression = (expression === "0" ? "" : expression) + keyValue;
      } else {
        if (!["+", "-", "*", "/", "."].includes(last)) {
          newExpression = expression + keyValue;
        }
      }
    }

    this.setState({
      expression: newExpression
    });

    return this.expression2display(newExpression);
  }

  calculate(expression) {
    let result = "0";

    try {
      result = eval(expression) + "";
      result === "undefined" ? "0" : result;
    } catch (err) {
      alert("请检查您的表达式是否正确");
    }

    return result;
  }

  expression2display(expression) {
    expression = expression ? expression : "0";
    let display = "";

    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === "*") {
        display += "×";
        continue;
      }

      if (expression[i] === "/") {
        display += "÷";
        continue;
      }

      display += expression[i];
    }

    return display;
  }
}

new Calculator();
