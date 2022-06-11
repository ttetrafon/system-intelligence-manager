const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";

  div {
    border-radius: 10px;
    margin-top: 15px;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    gap: 10px;
  }

  attribute-item {
    width: 100%;
  }

  .dragging {
    opacity: 0.5;
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
    // console.log(`AttributesSection.attributeChangedCallback(property: ${property}, oldValue: ${oldValue}, newValue: ${newValue})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "attributes":
        this.$intro.text = this.attributes.intro;
        while(this.$container.lastChild) {
          this.$container.removeChild(this.$container.lastChild);
        }
        for (let i = 0; i < this.attributes.attributes.length; i++) {
          let element = document.createElement("attribute-item");
          this.$container.appendChild(element);
          element.index = i;
          element.names = this.names;
          element.attribute_data = this.attributes.attributes[i];
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

  getDragAfterElement(y) {
    let elements = [...this.$container.querySelectorAll(".draggable:not(.dragging)")];
    console.log("- elements:", elements);
    return elements.reduce((closest, child) => {
      console.log("... closest:", closest);
      let box = child.getBoundingClientRect();
      console.log("... box", box);
      let offset = y - box.top - box.height / 2;
      console.log("... offset", offset);
      if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
      else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
}

window.customElements.define('attributes-section', AttributesSection);