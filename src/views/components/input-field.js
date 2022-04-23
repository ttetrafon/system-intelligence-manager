const template = document.createElement('template');

template.innerHTML = `
<style>
div {
    margin: 0;
    padding: 0;
    position: relative;
  }

  button {
    position: absolute;
    right: -1rem;
    font-size: 0.95rem;
    display: inline-block;
    border: none;
    border-radius: 25%;
    background: none;
    font-weight: bold;
    color: var(--colour_controls);
    cursor: pointer;
    display: none;
  }
  button:hover {
    border-left: var(--colour_title) solid 2px;
    border-right: var(--colour_title) solid 2px;
    margin-left: -2px;
    margin-right: -2px;
  }

  #confirm-btn {
    margin-top: -8px;
    top: 0;
  }

  #cancel-btn {
    margin-bottom: -8px;
    bottom: 0;
  }

  input {
    width: 90%;
    border: none;
    background: none;
    height: 1.4rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    text-align: left;
    padding: 0 5px;
  }

  input:focus {
    outline: none;
    background-color: var(--colour_back_white);
  }

  .active {
    display: inherit;
  }
</style>

<div>
  <input placeholder="placeholder" type="text" />
  <button id="confirm-btn">&#9745;</button>
  <button id="cancel-btn">&#9746;</button>
</div>
`;

class InputField extends HTMLElement {
  constructor() {
    super();

    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$input = this._shadow.querySelector("input");
    this.$confirm = this._shadow.getElementById("confirm-btn");
    this.$cancel = this._shadow.getElementById("cancel-btn");

    this.$input.addEventListener('keyup', ({target}) => {
      let newValue = target.value;
      if (newValue !== this.text) {
        this.showButtons();
      }
      else {
        this.hideButtons();
      }
    });
    this.$confirm.addEventListener('click', _ => {
      this.dispatchEvent(
        new CustomEvent('valueChanged', {
          bubbles: true,
          composed: true,
          detail: {
            type: this.type,
            target: this.target.split('.'),
            value: this.$input.value,
          }
        })
      );
      this.text = this.$input.value;
      this.hideButtons();
    });
    this.$cancel.addEventListener('click', _ => {
      this.$input.value = this.text;
      this.hideButtons();
    });
  }

  static get observedAttributes() {
    return [ "type", "target", "placeholder", "text" ];
  }

  get type() { return this.getAttribute("type"); }
  get target() { return this.getAttribute("target"); }
  get placeholder() { return this.getAttribute("placeholder"); }
  get text() { return this.getAttribute("text"); }

  set type(value) { this.setAttribute("type", value); }
  set target(value) { this.setAttribute("target", value); }
  set placeholder(value) { this.setAttribute("placeholder", value); }
  set text(value) { this.setAttribute("text", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch(property){
      case "placeholder":
        this.$input.placeholder = this.placeholder;
        break;
      case "text":
        this.$input.value = this.text;
    }
  }

  showButtons() {
    this.$confirm.classList.add("active");
    this.$cancel.classList.add("active");
  }

  hideButtons() {
    this.$confirm.classList.remove("active");
    this.$cancel.classList.remove("active");
  }
}

window.customElements.define('input-field', InputField);