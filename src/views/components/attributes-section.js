const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";

  div {
    border: 1px solid black;
    border-radius: 10px;
    box-shadow: 2px 2px 1px var(--colour_back_white);
    margin-top: 15px;
    padding: 15px;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    gap: 10px;
  }

  attribute-item {
    width: 100%;
  }
</style>

<h1>Attributes</h1>
<text-editor id="intro"
  type="gameSystem"
  target="gameSystem.$attributes.intro"
></text-editor>
<div></div>
`;

class AttributesSection extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$intro = this._shadow.getElementById("intro");
    this.$container = this._shadow.querySelector("div");
  }

  static get observedAttributes() {
    return [ "attributes", "user_role", "names" ];
  }

  get attributes() { return JSON.parse(this.getAttribute("attributes")); }
  get user_role() { return this.getAttribute("user_role"); }
  get names() { return JSON.parse(this.getAttribute("names")); }

  set attributes(value) { this.setAttribute("attributes", JSON.stringify(value)); }
  set user_role(value) { this.setAttribute("user_role", value); }
  set names(value) { this.setAttribute("names", JSON.stringify(value)); }

  attributeChangedCallback(property, oldValue, newValue) {
    // console.log(`AttributesSection.attributeChangedCallback(${property}, ${oldValue}, ${newValue})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "attributes":
        this.$intro.text = this.attributes.intro;
        for (let i = 0; i < this.attributes.attributes.length; i++) {
          let element = document.createElement("attribute-item");
          element.names = this.names;
          element.attribute_data = this.attributes.attributes[i];
          this.$container.appendChild(element);
        }
        this.setUserRoles();
        break;
      case "user_role":
        this.setUserRoles();
        break;
    }
  }

  setUserRoles() {
    if (this.user_role) {
      for (let i = 0; i < this.$container.childElementCount; i++) {
        this.$container.children[i].user_role = this.user_role;
      }
    }
  }

}

window.customElements.define('attributes-section', AttributesSection);