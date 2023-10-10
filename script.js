class VerifyCodeComponent {
  constructor({
    title = "",
    message = "",
    value = "",
    length = 3,
    placeholder = "",
    onChange,
  }) {
    this.length = length >= 3 ? length : 3;
    this.placeholder = placeholder;
    this.$root = this.createRoot({ messageValue: message, titleValue: title });
    this.writeInputValue(value);
    this.__value = value.split("");
    this.onChange = onChange;
  }

  createRoot({ titleValue, messageValue }) {
    const root = document.createElement("div");
    root.classList.add("code-form-container");

    const title = document.createElement("h2");
    title.classList.add("code-form-title");
    title.textContent = titleValue;

    const message = document.createElement("p");
    message.classList.add("code-form-message");
    message.textContent = messageValue;

    const form = document.createElement("form");
    form.classList.add("code-form");

    for (let index = 0; index < this.length; index++) {
      const input = document.createElement("input");

      input.classList.add("code-input");
      input.setAttribute("type", "number");
      input.setAttribute("min", "0");
      input.setAttribute("max", "9");
      input.setAttribute("required", "");
      input.setAttribute("pattern", "\\d*");
      input.setAttribute("placeholder", this.placeholder);
      input.setAttribute("data-index", index);

      input.addEventListener("input", (event) => {
        if (event.inputType === "insertFromPaste") {
          this.writeInputValue(event.target.value);
        }
      });

      input.addEventListener("keydown", (event) => this.onInputKeydown(event));

      form.appendChild(input);
    }

    root.append(title, message, form);

    return root;
  }

  onInputKeydown(event) {
    const { target, key } = event;
    const index = Number(target.dataset.index);

    if (key.includes("ArrowLeft") || key.includes("ArrowRight")) {
      this.focusInput(key === "ArrowLeft" ? index - 1 : index + 1);
    } 

    if (key === "Backspace") {
      this.__value[index] = "";
      this.focusInput(index - 1);
    }

    if (/\d/.test(key)) {
      alert(key)
      this.getInput(index).value = '';
      this.__value[index] = key;
      // this.focusInput(index + 1);
    } 

    const codeValue = this.__value.join("");
    if (codeValue.length) this.onChange?.(codeValue);
  }

  writeInputValue(value = "") {
    if (!value.length || /\D/g.test(value)) return;
    const values = value.split("").slice(0, this.length);
    values.forEach((val, index) => (this.getInput(index).value = val));
  }

  focusInput(index) {
    setTimeout(() => this.getInput(index)?.focus(), 0);
  }

  getInput(index) {
    return this.$root.querySelector(`[data-index="${index}"]`);
  }
}

document.body.append(
  new VerifyCodeComponent({
    title: "Verify Your Account",
    message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    length: 6,
    placeholder: "0",
  }).$root
);
