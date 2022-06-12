const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";

  .attributes-container {
    border-radius: 10px;
    margin-top: 15px;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    gap: 15px;
  }

  attribute-item {
    width: 100%;
  }

  .order-container {
    width: 12rem;
    background-color: var(--colour_back_dark);
    padding: 0.5rem;
    margin-top: 1rem;
    margin-left: 2rem;
    border-radius: 10px;
  }

  .draggable {
    text-align: center;
    margin: 0.5rem;
    padding: 0.5rem;
    background-color: var(--colour_back_light);
    border: 1px solid black;
    cursor: move;
    border-radius: 10px;
  }

  .dragging {
    opacity: 0.5;
    background-color: yellow;
  }
</style>

<h1>Attributes</h1>
<text-editor id="intro"
  type="gameSystem"
  target="gameSystem.$attributes.intro"
></text-editor>
<div class="attributes-container"></div>

<div class="settings">
  <h4>Attribute Settings</h4>
  <p>Define here the order the attributes appear in the creature sheet, by dragging and dropping them around.</p>
  <div class="order-container"></div>
</div>
`;

class AttributesSection extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$intro = this._shadow.getElementById("intro");
    this.$attributesContainer = this._shadow.querySelector(".attributes-container");
    this.$settings = this._shadow.querySelector(".settings");
    this.$orderContainer = this._shadow.querySelector(".order-container");

    this.$orderContainer.addEventListener("dragover", e => {
      e.preventDefault();
      const afterElement = this.getDragAfterElement(e.clientY);
      const draggable = this._shadow.querySelector(".dragging");
      if (afterElement) this.$orderContainer.insertBefore(draggable, afterElement);
      else this.$orderContainer.appendChild(draggable);
    });
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
        // empty the containers
        while(this.$attributesContainer.lastChild) {
          this.$attributesContainer.removeChild(this.$attributesContainer.lastChild);
        }
        while(this.$orderContainer.lastChild) {
          this.$attributesContainer.removeChild(this.$attributesContainer.lastChild);
        }
        for (let i = 0; i < this.attributes.order.length; i++) {
          let uid = this.attributes.order[i];
          // create the attribute elements
          let element = document.createElement("attribute-item");
          this.$attributesContainer.appendChild(element);
          element.uid = uid;
          element.names = this.names;
          element.attribute_data = this.attributes.attributes[uid];
          // create the attribute order elements
          let order = document.createElement("div");
          this.$orderContainer.appendChild(order);
          order.classList.add("draggable");
          order.textContent = this.attributes.attributes[uid].mod;
          order.setAttribute("id", this.uid);
          order.setAttribute("draggable", true);
          order.addEventListener("dragstart", _ => {
            order.classList.add("dragging");
          });
          order.addEventListener("dragend", _ => {
            order.classList.remove("dragging");
            this.dispatchReorderEvent();
          });
        }
        this.setUserRoles();
        break;
      case "user_role":
        this.$settings.style.display = (this.user_role === "GM") ? "block" : "none";
        this.setUserRoles();
        break;
    }
  }

  setUserRoles() {
    if (this.user_role) {
      for (let i = 0; i < this.$attributesContainer.childElementCount; i++) {
        this.$attributesContainer.children[i].user_role = this.user_role;
      }
    }
  }

  getDragAfterElement(y) {
    let elements = [...this.$orderContainer.querySelectorAll(".draggable:not(.dragging)")];
    return elements.reduce((closest, child) => {
      let box = child.getBoundingClientRect();
      let offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
      else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  dispatchReorderEvent() {
    this.dispatchEvent(
      new CustomEvent("valueChanged", {
        bubbles: true,
        composed: true,
        detail: {
          type: "attribute",
          target: ["attribute", "order"],
          value: this.getNewAttributeOrder()
        }
      })
    );
  }

  getNewAttributeOrder() {
    // console.log("---> getNewAttributeOrder()");
    let newOrder = [];
    for (let i = 0; i < this.$orderContainer.children.length; i++) {
      newOrder.push(this.$orderContainer.children[i].id);
    }
    // console.log("newOrder:", newOrder);
    return newOrder;
  }
}

window.customElements.define('attributes-section', AttributesSection);