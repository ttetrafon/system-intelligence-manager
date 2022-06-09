const template = document.createElement('template');

template.innerHTML = `
<style>
  .att {
    width: 100%;
    padding: 5px;
    border-radius: 5px;
    box-shadow: var(--box_shadow_light);
    display: flex;
    flex-flow: column nowrap;
    gap: 0.1rem;
  }

  .line {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    gap: 0.2rem;
    align-items: baseline;
    font-weight: bold;
  }

  .name {
    font-size: 1.2rem;
  }

  .mod, .mod-text {
    font-size: 1.1rem;
  }

  .name, .mod-text {
    color: var(--colour_attribute);
    text-shadow: var(--title_shadow);
  }

  text-editor {
    padding-left: 10px;
  }
</style>

<div class="att">
  <div class="line">
    <span class="name">Name</span>
    <span class="mod">[</span>
    <span class="mod-text">MOD</span>
    <span class="mod">]</span>
  </div>
  <text-editor
    type="type?"
    target="target?"
  ></text-editor>
</div>
`;

class AttributeItem extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$description = this._shadow.querySelector("text-editor");
    this.$name = this._shadow.querySelector(".name");
    this.$mod = this._shadow.querySelector(".mod-text");
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
    // console.log(`AttributeItem.attributeChangedCallback(property: ${property}, oldValue: ${oldValue}, newValue: ${newValue})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "attribute_data":
        this.$mod.textContent = this.attribute_data.mod;
        this.updateName();
        this.$description.type = "attribute-description";
        this.$description.text = this.attribute_data.description;
      case "user_role":
        this.$description.user_role = this.user_role;
        break;
      case "names":
        this.updateName();
        break;
    }
  }

  updateName() {
    if (this.names && this.attribute_data) {
      this.$name.textContent = this.names[this.attribute_data.uid];
    }
  }
}

window.customElements.define('attribute-item', AttributeItem);