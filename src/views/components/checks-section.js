const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";

  label {
    font-size: 0.9rem;
  }
</style>

<h1>Checks</h1>
<text-editor id="intro-text"
  type="gameSystem"
  target="gameSystem.$checks.intro"
></text-editor>

<h2 class="use-section-checkbox">
  Attribute Checks
  <label>
    Use attribute checks?
    <input id="use-attributes-checkbox" type="checkbox"/>
  </label>
</h2>
<section id="attribute-checks-section">
  Attributes section data...
</section>
`;

class ChecksSection extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$intro = this._shadow.getElementById("intro-text");

    this.$checkboxUseAttributeChecks = this._shadow.getElementById("use-attributes-checkbox");
    this.$sectionAttributes = this._shadow.getElementById("attribute-checks-section");
    this.$checkboxUseAttributeChecks.addEventListener("change", ({target}) => {
      this.dispatchEvent(
        new CustomEvent('valueChanged', {
          bubbles: true,
          composed: true,
          detail: {
            type: "checks",
            target: ["gameSystem", "$checks", "useAttributeChecks"],
            value: target.checked
          }
        })
      );
      this.$sectionAttributes.style.display = (target.checked ? "inherit" : "none");
    });
  }

  static get observedAttributes() {
    return [ "checks", "user_role" ];
  }

  get checks() { return JSON.parse(this.getAttribute("checks")); }
  get user_role() { return this.getAttribute("user_role"); }
  get use_attribute_checks() { return this.getAttribute("use_attribute_checks"); }

  set checks(value) { this.setAttribute("checks", JSON.stringify(value)); }
  set user_role(value) { this.setAttribute("user_role", value); }
  set use_attribute_checks(value) { this.setAttribute("use_attribute_checks", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    // console.log(`attributeChangedCallback(${property}, ${oldValue}, ${newValue})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "checks":
        this.$intro.text = this.checks.intro;
        this.$checkboxUseAttributeChecks.checked = this.checks.useAttributeChecks;
        this.$sectionAttributes.style.display = (this.checks.useAttributeChecks ? "inherit" : "none");
        break;
      case "user_role":
        this.$intro.user_role = this.user_role;
        break;
    }
  }
}

window.customElements.define('checks-section', ChecksSection);