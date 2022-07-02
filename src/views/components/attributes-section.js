// The attributes section included information and controls for the game system attributes.
const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";
  @import "./styles/controls.css";

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

  #new-attribute {
    width: 13rem;
    margin-left: 2rem;
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
  <p>Create a new attribute and define its details on the attribute list above.</p>
  <button id="new-attribute">Create New Attribute</button>
  <p>Define the order attributes appear in the creature sheet by dragging and dropping them around.</p>
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
    this.$newAttributeInput = this._shadow.getElementById("new-attribute");
    this.$orderContainer = this._shadow.querySelector(".order-container");

    this.$newAttributeInput.addEventListener("click", async () => {
      // Triggered when a new attribute-item is created.
      // get a new uid
      let newUid = await window.main.generateUid();
      // create a new entry in the names dictionary
      this.dispatchEvent(
        new CustomEvent("valueChanged", {
          bubbles: true,
          composed: true,
          detail: {
            type: "dictionary",
            target: [ "$names", newUid ],
            value: "Attribute Name"
          }
        })
      )
      // update the attributes object in the state
      let newAttributeData = this.attributeData;
      newAttributeData.attributes[newUid] = { mod: "MOD", description: "Description" };
      newAttributeData.order.push(newUid);
      this.dispatchEvent(
        new CustomEvent("valueChanged", {
          bubbles: true,
          composed: true,
          detail: {
            type: "gameSystem",
            target: ["$attributes"],
            value: newAttributeData
          }
        })
      );
      // TODO: create the new UI element for the attribute
      let newAttributeItem = document.createElement("attribute-item");
      this.$attributesContainer.appendChild(newAttributeItem);
      newAttributeItem.uid = newUid;
      newAttributeItem.names = this.names;
      newAttributeItem.attribute_data = newAttributeData.attributes[newUid];
    });
    this.$orderContainer.addEventListener("dragover", e => {
      // Finds where a draggable element is within the list of draggable elements, and inserts it into the correct position.
      e.preventDefault();
      const afterElement = this.getDragAfterElement(e.clientY);
      const draggable = this._shadow.querySelector(".dragging");
      if (afterElement) this.$orderContainer.insertBefore(draggable, afterElement);
      else this.$orderContainer.appendChild(draggable);
    });
  }

  static get observedAttributes() {
    return [ "attributeData", "user_role", "names" ];
  }

  get attributeData() { return JSON.parse(this.getAttribute("attributeData")); }
  get user_role() { return this.getAttribute("user_role"); }
  get names() { return JSON.parse(this.getAttribute("names")); }

  set attributeData(value) { this.setAttribute("attributeData", JSON.stringify(value)); }
  set user_role(value) { this.setAttribute("user_role", value); }
  set names(value) { this.setAttribute("names", JSON.stringify(value)); }

  attributeChangedCallback(property, oldValue, newValue) {
    // console.log(`AttributesSection.attributeChangedCallback(property: ${property}, oldValue: ${oldValue}, newValue: ${JSON.stringify(newValue)})`);
    if (oldValue === newValue) return;
    switch(property) {
      case "attributeData":
        console.log("... new attributeData", this.attributeData);
        this.$intro.text = this.attributeData.intro;
        // empty the containers
        while(this.$attributesContainer.lastChild) {
          this.$attributesContainer.removeChild(this.$attributesContainer.lastChild);
        }
        while(this.$orderContainer.lastChild) {
          this.$attributesContainer.removeChild(this.$attributesContainer.lastChild);
        }
        for (let i = 0; i < this.attributeData.order.length; i++) {
          let uid = this.attributeData.order[i];
          // create the attribute elements
          let element = document.createElement("attribute-item");
          this.$attributesContainer.appendChild(element);
          element.uid = uid;
          element.names = this.names;
          element.attribute_data = this.attributeData.attributes[uid];
          // create the attribute order elements
          let order = document.createElement("div");
          this.$orderContainer.appendChild(order);
          order.classList.add("draggable");
          order.textContent = this.attributeData.attributes[uid].mod;
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
        this.setNewAttributeEvent();
        break;
      case "user_role":
        this.$settings.style.display = (this.user_role === "GM") ? "block" : "none";
        this.setUserRoles();
        break;
    }
  }

  setUserRoles() {
    // User roles are being updated dynamically, as the attribute-item list is not static.
    if (this.user_role) {
      for (let i = 0; i < this.$attributesContainer.childElementCount; i++) {
        this.$attributesContainer.children[i].user_role = this.user_role;
      }
    }
  }

  getDragAfterElement(y) {
    // Finds after which element in the draggable list the one being currently dragged is.
    // - y: The y-coordinate of the element.
    let elements = [...this.$orderContainer.querySelectorAll(".draggable:not(.dragging)")];
    return elements.reduce((closest, child) => {
      let box = child.getBoundingClientRect();
      let offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
      else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  dispatchReorderEvent() {
    // Notify the state when the attribute order has been changed.
    this.dispatchEvent(
      new CustomEvent("valueChanged", {
        bubbles: true,
        composed: true,
        detail: {
          type: "gameSystem",
          target: ["$attributes", "order"],
          value: this.getNewAttributeOrder()
        }
      })
    );
    // TODO: reorder the attribute list
  }

  getNewAttributeOrder() {
    // Returns the current attribute order, as determined by the tiles in the attribute-order container.
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