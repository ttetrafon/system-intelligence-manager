// A view-tab comes as a child of a nav-tab, and controls which view is shows on the window.

const template = document.createElement('template');

template.innerHTML = `
<style>
  .view-container {
    padding: 3px 8px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    border-radius: 5px;
  }

  .view-container:hover {
    border-left: var(--colour_title) solid 1px;
    background-color: var(--colour_back_light);
  }

  .view-image {
    width: 22px;
    height: 22px;
  }

  .view-text {
    font-size: 0.75rem;
  }

  .selected {
    border: var(--colour_title) solid 1px;
  }
</style>

<div class="view-container">
  <img class="view-image" src="#" />
  <span class="view-text">View</view>
</div>
`;

class ViewTab extends HTMLElement {
  constructor() {
    super();

    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$container = this._shadow.querySelector(".view-container");
    this.$view = this._shadow.querySelector(".view-text");
    this.$image = this._shadow.querySelector(".view-image");

    this.$container.addEventListener("click", _ => {
      // Notify the parent nav-tab to change the view.
      this.dispatchEvent(
        new CustomEvent("onViewSelected", {
          bubbles: true,
          composed: true,
          detail: this.id
        })
      );
    });
  }

  static get observedAttributes() {
    return ["id", "title", "image", "selected"];
  }

  get id() { return this.getAttribute("id"); }
  get image() { return this.getAttribute("image"); }
  get title() { return this.getAttribute("title"); }
  get selected() { return this.getAttribute("selected"); }

  set id(value) { this.setAttribute("id", value); }
  set image(value) { this.setAttribute("image", value); }
  set title(value) { this.setAttribute("title", value); }
  set selected(value) { this.setAttribute("selected", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch(property) {
      case "image":
        this.$image.src = this.image;
        break;
      case "selected":
        if (this.selected == 'selected') {
          this.$container.classList.add("selected");
        }
        else {
          this.$container.classList.remove("selected");
        }
        break;
      case "title":
        this.$view.innerHTML = this.title;
        break;
      default:
        break;
    }
  }
}

window.customElements.define('view-tab', ViewTab);