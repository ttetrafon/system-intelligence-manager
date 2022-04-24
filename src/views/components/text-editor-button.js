const template = document.createElement('template');

template.innerHTML = `
<style>
  button {
    position: relative;
    width: 33px;
    height: 33px;
    background-color: var(--colour_back_light);
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 2px 2px 1px var(--colour_back_white);
  }
  button:hover {
    border: var(--colour_title) solid 2px;
    box-shadow: none;
  }

  img {
    width: 100%;
    height: 85%;
  }

  span {
    display: none;
    background-color: var(--colour_back_light);
    white-space: nowrap;
    position: absolute;
    left: 50%;
    bottom: 125%;
    transform: translateX(-50%);
    border: 1px solid var(--colour_back_dark);
    border-radius: 5px;
    padding: 2px;
  }

  button:hover span {
    display: block;
  }
</style>

<button><img src="./UI/buttons/Editor - title.png" />
  <span></span>
</button>
`;

class TextEditorButton extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$button = this._shadow.querySelector("button");
    this.$image = this._shadow.querySelector("img");
    this.$tooltip = this._shadow.querySelector("span");

    this.$button.addEventListener('click', _ => {
      this.dispatchEvent(
        new CustomEvent('editorButton', {
          bubbles: true,
          composed: true,
          detail: {
            id: this.id
          }
        })
      )
    });
  }

  static get observedAttributes() {
    return [ "id", "tooltip", "image" ];
  }

  get id() { return this.getAttribute("id"); }
  get image() { return this.getAttribute("image"); }
  get tooltip() { return this.getAttribute("tooltip"); }

  set id(value) { this.setAttribute("id", value); }
  set image(value) { this.setAttribute("image", value); }
  set tooltip(value) { this.setAttribute("tooltip", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch(property) {
      case "image":
        this.$image.src = this.image;
        break;
      case "tooltip":
        this.$tooltip.innerHTML = this.tooltip;
        break;
    }
  }
}

window.customElements.define('text-editor-button', TextEditorButton);