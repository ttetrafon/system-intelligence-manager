// The checks section included information and controls on how checks are performed in the game.
// It contains a list of subsections, with each subsection defining a different resolution mechanic.
const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";
</style>

<h1>Checks</h1>
<text-editor id="intro-text"
  type="gameSystem"
  target="gameSystem.$checks.intro"
></text-editor>
<checks-sub-section id="main"></checks-sub-section>
<checks-sub-section id="secondary"></checks-sub-section>
`;

class ChecksSection extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$intro = this._shadow.getElementById("intro-text");

    this.$checkboxUseAttributeChecks = this._shadow.getElementById("use-attributes-checkbox");
    this.$sectionAttributes = this._shadow.getElementById("attribute-checks-section");

    this.$main = this._shadow.getElementById("main");
    this.$secondary = this._shadow.getElementById("secondary");
  }

  static get observedAttributes() {
    return [ "checks", "user_role" ];
  }

  get checks() { return JSON.parse(this.getAttribute("checks")); }
  get user_role() { return this.getAttribute("user_role"); }

  set checks(value) { this.setAttribute("checks", JSON.stringify(value)); }
  set user_role(value) { this.setAttribute("user_role", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    // console.log(`ChecksSection.attributeChangedCallback(${property}, ${oldValue}, ${newValue})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "checks":
        this.$intro.text = this.checks.intro;
        this.$main.checks = {
          used: this.checks.mainUsed,
          name: this.checks.mainName,
          description: this.checks.mainDescription
        };
        this.$secondary.checks = {
          used: this.checks.secondaryUsed,
          name: this.checks.secondaryName,
          description: this.checks.secondaryDescription
        };
        break;
      case "user_role":
        this.$intro.user_role = this.user_role;
        this.$main.user_role = this.user_role;
        this.$secondary.user_role = this.user_role;
        break;
    }
  }
}

window.customElements.define('checks-section', ChecksSection);