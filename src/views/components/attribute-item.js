const template = document.createElement('template');

template.innerHTML = `
<style>
  div {
    width: 100%;
    background-color: yellow;
    padding: 4px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px var(--colour_back_white);
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
    align-content: stretch;
    gap: 1rem;
  }

  .grown {
    flex-grow: 1;
  }
</style>

<div>
  <span>"handle"</span>
  <span>num</span>
  <span>Att Name</span>
  <span>MOD</span>
  <span class="grown">
    <text-editor text="attribute's description"></text-editor>
  </span>
</div>
`;

class AttributeItem extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return [ "attribute_data", "user_role", "names" ];
  }

  get attribute_data() { return JSON.parse(this.getAttribute("attribute_data")); }
  get user_role() { return this.getAttribute("user_role"); }
  get names() { return JSON.parse(this.getAttribute("names")); }

  set attribute_data(value) { this.setAttribute("attribute_data", JSON.stringify(value)); }
  set user_role(value) { this.setAttribute("user_role", value); }
  set names(value) { this.setAttribute("names", JSON.stringify(value)); }

  attributeChangedCallback(property, oldValue, newValue) {
    // console.log(`AttributeItem.attributeChangedCallback(${property}, ${oldValue}, ${newValue})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "attribute_data":
        break;
      case "user_role":
        break;
    }
  }
}

window.customElements.define('attribute-item', AttributeItem);