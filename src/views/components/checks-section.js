const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";
</style>

<h1>Checks</h1>
<text-editor id="intro-text"
  type="gameSystem"
  target="gameSystem.checks.intro"
></text-editor>
`;

class ChecksSection extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$intro = this._shadow.getElementById("intro-text");
  }

  static get observedAttributes() {
    return [ "userRole", "checks" ];
  }

  get userRole() { return this.getAttribute("userRole"); }
  get checks() { return JSON.parse(this.getAttribute("checks")); }

  set userRole(value) { this.setAttribute("userRole", value); }
  set checks(value) { this.setAttribute("checks", JSON.stringify(value)); }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch(property) {
      case "checks":
        this.$intro.text = this.checks.intro;
        break;
      case "userRole":
        this.$intro.userRole = this.userRole;
        break;
    }
  }
}

window.customElements.define('checks-section', ChecksSection);