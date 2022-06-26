// A button on the text-editor's menu.

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

  #container {
    position: absolute;
    top: 115%;
    left: -15%;
    padding: 10px;
    display: none;
    background-color: var(--colour_back_light);
    border: 1px solid var(--colour_back_dark);
    border-radius: 10px;
    white-space: nowrap;
    }
  button:hover #container {
    display: flex;
    flex-direction: column;
  }

  #container h1, #container h2, #container h3, #container h4, #container h5, #container h6 {
    padding: 5px 10px;
    margin: 5px;
    border: 1px solid var(--colour_back_dark);
    border-radius: 10px;
  }
  #container h1:hover, #container h2:hover, #container h3:hover, #container h4:hover, #container h5:hover, div h6:hover {
    box-shadow: 3px 3px 5px var(--colour_back_dark);
  }

  h1 {
    font-size: 1.75rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.4rem;
  }

  h4 {
    font-size: 1.3rem;
  }

  h5 {
    font-size: 1.2rem;
  }

  h6 {
    font-size: 1.1rem;
  }

</style>

<button><img src="./UI/buttons/Editor - title.png" />
  <span>tooltip...</span>
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
      // An event is sent to the text-editor when a button is clicked.
      // Compound button roots (ones with submenus, like 'title') do not send this event.
      if (['title'].includes(this.id)) return;
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
      case "id":
        // Create submenus for appropriate buttons (e.g.: title) here.
        if (this.id == 'title') {
          let container = this.createTitleSubMenu();
          this.$button.appendChild(container);
        }
        break;
      case "image":
        this.$image.src = this.image;
        break;
      case "tooltip":
        this.$tooltip.innerHTML = this.tooltip;
        break;
    }
  }

  createTitleSubMenu() {
    let container = document.createElement("div");
    container.id = "container";
    let h1 = document.createElement("h1");
    h1.innerHTML = "Heading 1 (#1)";
    h1.addEventListener('click', _ => {
      this.dispatchEvent(
        new CustomEvent('editorButton', {
          bubbles: true,
          composed: true,
          detail: {
            id: "title1"
          }
        })
      )
    });
    container.appendChild(h1);
    let h2 = document.createElement("h2");
    h2.innerHTML = "Heading 2 (#2)";
    h2.addEventListener('click', _ => {
      this.dispatchEvent(
        new CustomEvent('editorButton', {
          bubbles: true,
          composed: true,
          detail: {
            id: "title2"
          }
        })
      )
    });
    container.appendChild(h2);
    let h3 = document.createElement("h3");
    h3.innerHTML = "Heading 3 (#3)";
    h3.addEventListener('click', _ => {
      this.dispatchEvent(
        new CustomEvent('editorButton', {
          bubbles: true,
          composed: true,
          detail: {
            id: "title3"
          }
        })
      )
    });
    container.appendChild(h3);
    let h4 = document.createElement("h4");
    h4.innerHTML = "Heading 4 (#4)";
    h4.addEventListener('click', _ => {
      this.dispatchEvent(
        new CustomEvent('editorButton', {
          bubbles: true,
          composed: true,
          detail: {
            id: "title4"
          }
        })
      )
    });
    container.appendChild(h4);
    let h5 = document.createElement("h5");
    h5.innerHTML = "Heading 5 (#5)";
    h5.addEventListener('click', _ => {
      this.dispatchEvent(
        new CustomEvent('editorButton', {
          bubbles: true,
          composed: true,
          detail: {
            id: "title5"
          }
        })
      )
    });
    container.appendChild(h5);
    let h6 = document.createElement("h6");
    h6.innerHTML = "Heading 6 (#6)";
    h6.addEventListener('click', _ => {
      this.dispatchEvent(
        new CustomEvent('editorButton', {
          bubbles: true,
          composed: true,
          detail: {
            id: "title6"
          }
        })
      )
    });
    container.appendChild(h6);
    return container;
  }
}

window.customElements.define('text-editor-button', TextEditorButton);