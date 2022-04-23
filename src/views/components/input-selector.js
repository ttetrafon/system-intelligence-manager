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

  select {
    width: 98%;
    border: none;
    background: none;
    height: 1.4rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    text-align: left;
    padding: 0 5px;
  }

  select:focus {
    outline: none;
    background-color: var(--colour_back_white);
  }

  .active {
    display: inherit;
  }
</style>

<div>
  <select></select>
  <button id="confirm-btn">&#9745;</button>
  <button id="cancel-btn">&#9746;</button>
</div>
`;

class InputSelector extends HTMLElement {
  constructor() {
    super();

    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$selector = this._shadow.querySelector("select");
    this.$confirm = this._shadow.getElementById("confirm-btn");
    this.$cancel = this._shadow.getElementById("cancel-btn");

    this.$selector.addEventListener('change', ({target}) => {
      let newSelection = target.value;
      if (newSelection === this.options.selected) {
        this.hideButtons();
      }
      else {
        this.showButtons();
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
            value: this.$selector.value
          }
        })
      );
      this.options.selected = this.$selector.value;
      this.hideButtons();
    });
    this.$cancel.addEventListener('click', _ => {
      this.$selector.value = this.options.selected;
      this.hideButtons();
    });
  }

  static get observedAttributes() {
    return [ "type", "target", "options" ];
  }

  get type() { return this.getAttribute("type"); }
  get target() { return this.getAttribute("target"); }
  get options() { return JSON.parse(this.getAttribute("options")); }

  set type(value) { this.setAttribute("type", value); }
  set target(value) { this.setAttribute("target", value); }
  set options(value) { this.setAttribute("options", JSON.stringify(value)); }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch(property) {
      case "options":
        // let opts = document.querySelectorAll("option");
        for (let i = this.$selector.options.length - 1; i >= 0; i--) {
          this.$selector.options[i].remove();
        }
        for (let i = 0; i < this.options.list.length; i++) {
          var opt = document.createElement("option");
          opt.value = this.options.list[i];
          opt.innerHTML = this.options.list[i];
          this.$selector.appendChild(opt);
        }
        this.$selector.value = this.options.selected;
        break;
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

window.customElements.define('input-selector', InputSelector);