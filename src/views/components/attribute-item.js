const template = document.createElement('template');

template.innerHTML = `
<style>
  .att {
    position: relative;
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
    padding-left: 20px;
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

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    cursor: move;
  }
</style>

<div class="att">
  <img src="./UI/buttons/List 2.png">
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
    this.$sorter = this._shadow.querySelector("img");
  }

  static get observedAttributes() {
    return [ "attribute_data", "user_role", "names", "index" ];
  }

  get attribute_data() { return JSON.parse(this.getAttribute("attribute_data")); }
  get user_role() { return this.getAttribute("user_role"); }
  get names() { return JSON.parse(this.getAttribute("names")); }
  get index() { return this.getAttribute("index"); }

  set attribute_data(value) { this.setAttribute("attribute_data", JSON.stringify(value)); }
  set user_role(value) { this.setAttribute("user_role", value); }
  set names(value) { this.setAttribute("names", JSON.stringify(value)); }
  set index(value) { this.setAttribute("index", value); }

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
        this.defineDragEvents();
        break;
      case "names":
        this.updateName();
        break;
    }
  }

  defineDragEvents() {
    // console.log(`---> defineDragEvents(${this.user_role})`);
    if (!this.user_role) return;
    if (this.user_role == "GM") {
      this.$sorter.style.display = "inherited";
      this.$sorter.addEventListener("dragstart", () => {
        this.dispatchEvent(
          new CustomEvent('setDraggable', {
            bubbles: true,
            composed: true,
            detail: {
              index: this.index
            }
          })
        );
      });
      this.$sorter.addEventListener("dragend", () => {
        console.log("... dragend");
        this.dispatchEvent(
          new CustomEvent('unsetDraggable', {
            bubbles: true,
            composed: true,
            detail: {
              index: this.index
            }
          })
        );
      });
    }
    else {
      this.$sorter.style.display = "none";
      this.$sorter.removeEventListener("dragstart");
      this.$sorter.removeEventListener("dragend");
    }
  }

  updateName() {
    if (this.names && this.attribute_data) {
      this.$name.textContent = this.names[this.attribute_data.uid];
    }
  }
}

window.customElements.define('attribute-item', AttributeItem);