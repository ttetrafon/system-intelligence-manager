const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";

  label {
    font-size: 0.9rem;
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
  }

  static get observedAttributes() {
    return [ "checks_mech", "user_role" ];
  }

  get checks_mech() { return JSON.parse(this.getAttribute("checks_mech")); }
  get user_role() { return this.getAttribute("user_role"); }

  set checks_mech(value) { this.setAttribute("checks_mech", JSON.stringify(value)); }
  set user_role(value) { this.setAttribute("user_role", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    // console.log(`attributeChangedCallback(${property}, ${oldValue}, ${newValue})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "checks_mech":
        this.$name.innerHTML = this.checks_mech.name;
        this.$usedCheckbox.checked = this.checks_mech.used;
        this.$section.style.display = (this.checks_mech.used ? "inherit" : "none");
        this.$editor.text = this.checks_mech.description;
        break;
      case "user_role":
        this.$editor.user_role = this.user_role;
        break;
    }
  }

}

window.customElements.define('checks-sub-section', ChecksSubSection);