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
`;

class ChecksSection extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$intro = this._shadow.getElementById("intro-text");
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
        this.$intro.text = this.checks.intro;
        break;
      case "user_role":
        this.$intro.user_role = this.user_role;
        break;
    }
  }
}

window.customElements.define('checks-section', ChecksSection);