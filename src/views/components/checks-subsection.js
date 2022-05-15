const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";

  label {
    font-size: 0.9rem;
  }

  fieldset {
    margin-top: 10px;
  }
</style>

<h2 class="use-section-checkbox">
  <span id="name">Resolution Mechanic</span>
  <label>
    Use this resolution mechanic?
    <input id="use-checkbox" type="checkbox"/>
  </label>
</h2>
<section>
  <text-editor
    type="gameSystem"
  ></text-editor>

  <h3>Options</h3>

  <fieldset id="resolution">
    <legend>Select the resolution mechanic</legend>
    <div>
      <input type="radio" id="rollOver" name="resolution" value="rollOver" checked>
      <label for="rollOver">Roll Over</label>
    </div>
    <div>
      <input type="radio" id="rollUnder" name="resolution" value="rollUnder">
      <label for="rollUnder">Roll Under</label>
    </div>
  </fieldset>

  <fieldset id="bonuses">
    <legend>Select where bonuses and penalties apply</legend>
    <div>
      <input type="radio" id="rollValue" name="bonuses" value="rollValue" checked>
      <label for="rollValue">Roll Value</label>
    </div>
    <div>
      <input type="radio" id="diceNumber" name="bonuses" value="diceNumber">
      <label for="diceNumber">Dice Number</label>
    </div>
    <div>
      <input type="radio" id="none" name="bonuses" value="none">
      <label for="none">None</label>
    </div>
  </fieldset>

</section>
`;

class ChecksSubSection extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$name = this._shadow.getElementById("name");
    this.$usedCheckbox = this._shadow.getElementById("use-checkbox");
    this.$section = this._shadow.querySelector("section");
    this.$editor = this._shadow.querySelector("text-editor");
    this.$editor.target = `gameSystem.$checks.${this.id}Description`;
    this.$resolution = this._shadow.getElementById("resolution");
    this.$resolution = this._shadow.getElementById("bonuses");

    this.$usedCheckbox.addEventListener("change", ({target}) => {
      this.dispatchEvent(
        new CustomEvent('valueChanged', {
          bubbles: true,
          composed: true,
          detail: {
            type: "checks",
            target: ["gameSystem", "$checks", this.id + "Used"],
            value: target.checked
          }
        })
      );
      this.$section.style.display = (target.checked ? "inherit" : "none");
    });
    this.$resolution.addEventListener("change", ({target}) => {
      this.dispatchEvent(
        new CustomEvent('valueChanged', {
          bubbles: true,
          composed: true,
          detail: {
            type: "checks",
            target: ["gameSystem", "$checks", this.id + "Resolution"],
            value: target.value
          }
        })
      );
    });
    this.$resolution.addEventListener("change", ({target}) => {
      this.dispatchEvent(
        new CustomEvent('valueChanged', {
          bubbles: true,
          composed: true,
          detail: {
            type: "checks",
            target: ["gameSystem", "$checks", this.id + "BonusesOn"],
            value: target.value
          }
        })
      );
    });
  }

  static get observedAttributes() {
    return [ "checks", "user_role" ];
  }

  get checks() { return JSON.parse(this.getAttribute("checks")); }
  get user_role() { return this.getAttribute("user_role"); }

  set checks(value) { this.setAttribute("checks", JSON.stringify(value)); }
  set user_role(value) { this.setAttribute("user_role", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    // console.log(`attributeChangedCallback(${property}, ${oldValue}, ${newValue})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "checks":
        this.$name.innerHTML = this.checks.name;
        this.$usedCheckbox.checked = this.checks.used;
        this.$section.style.display = (this.checks.used ? "inherit" : "none");
        this.$editor.text = this.checks.description;
        break;
      case "user_role":
        this.$editor.user_role = this.user_role;
        break;
    }
  }

}

window.customElements.define('checks-sub-section', ChecksSubSection);