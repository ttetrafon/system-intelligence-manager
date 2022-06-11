const template = document.createElement('template');

template.innerHTML = `
<style>
  div {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
  }

  img {
    position: absolute;
    top: 0;
    right: 0;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }

  input-field {
    margin-left: 10px;
    display: none;
  }
</style>

<div>
  <span>Name</span>
  <img src="./UI/buttons/Pen 3.png" />
  <input-field></input-field>
</div>
`;

class EditableField extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$container = this._shadow.querySelector("div");
    this.$display = this._shadow.querySelector("span");
    this.$input = this._shadow.querySelector("input-field");
    this.$edit = this._shadow.querySelector("img");

    this.$edit.addEventListener("click", () => {
      // When the edit button is clicked, hide it and display the input field.
      this.$edit.style.display = "none";
      this.$input.style.display = "inherit";
    });
    this.$container.addEventListener("inputFieldCancel", () => {
      // When the input field is canceled, revert the display: show edit button, hide input-field.
      this.$edit.style.display = "inherit";
      this.$input.style.display = "none";
    });
    this.$container.addEventListener("valueChanged", ({detail}) => {
      // When the input field value has been changed, capture the event because we need to revert the display.
      // The actual displayed value will be updated when the attributes are updated.
      this.$edit.style.display = "inherit";
      this.$input.style.display = "none";
    });
  }

  static get observedAttributes() {
    return [ "user_role", "text", "type", "target", "placeholder" ];
  }

  get placeholder() { return this.getAttribute("placeholder"); }
  get target() { return this.getAttribute("target"); }
  get text() { return this.getAttribute("text"); }
  get type() { return this.getAttribute("type"); }
  get user_role() { return this.getAttribute("user_role"); }

  set placeholder(value) { this.setAttribute("placeholder", value); }
  set target(value) { this.setAttribute("target", value); }
  set text(value) { this.setAttribute("text", value); }
  set type(value) { this.setAttribute("type", value); }
  set user_role(value) { this.setAttribute("user_role", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    // console.log(`EditableField.attributeChangedCallback(property: ${property}, oldValue: ${oldValue}, newValue: ${newValue})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "placeholder":
        this.$input.placeholder = this.placeholder;
        break;
      case "target":
        this.$input.target = this.target;
        break;
      case "text":
        this.$display.textContent = this.text;
        this.$input.text = this.text;
        break;
      case "type":
        this.$input.type = this.type;
        break;
      case "user_role":
        this.$edit.style.display = (this.user_role === "GM" ? "inherit" : "none");
        this.$container.style.paddingRight = (this.user_role === "GM" ? "18px" : "0");
        break;
      }
  }
}

window.customElements.define('editable-field', EditableField);