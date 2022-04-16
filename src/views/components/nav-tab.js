const template = document.createElement('template');

template.innerHTML = `
<style>
  button {
    margin: 2px;
    width: 35px;
    height: 35px;
    z-index: 0;
    background-color: var(--colour_back_dark);
  }

  button img {
    width: 100%;
    height: 75%;
  }

  .tooltip-nav {
    position: relative;
    display: inline-block;
  }

  .tooltip-nav .tooltip-text {
    visibility: hidden;
    white-space: nowrap;
    background-color: var(--colour_back_dark);
    color: var(--colour_text_light);
    text-align: left;
    padding: 5px;
    border-radius: 6px;
    /* Position the tooltip text */
    position: absolute;
    z-index: 1;
    top: 2px;
    left: 40px;
    margin-left: 0px;
    /* Fade in tooltip */
    opacity: 0;
    transition: opacity 0.5s;
  }

  .tooltip-nav .tooltip-text::before {
    content: "";
    position: absolute;
    bottom: 7px;
    left: -5px;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent var(--colour_title) transparent transparent;
  }

  .tooltip-nav:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
</style>

<button class="nav-tab tooltip-nav">
  <img class="button-image" />
  <span class="tooltip-text"></span>
</button>
`;

class NavTab extends HTMLElement {
  constructor() {
    super();

    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$tab = this._shadow.querySelector(".nav-tab");
    this.$img = this._shadow.querySelector(".button-image");
    this.$tooltip = this._shadow.querySelector(".tooltip-text");

    this.$tab.addEventListener("click", _ => {
      this.dispatchEvent(
        new CustomEvent('onTabSelected', {
          bubbles: true,
          detail: this.$tab.id
        })
      );
    });
  }

  static get observedAttributes() {
    return ['tabName', "imgSrc", "tooltip"];
  }

  get tabName() { return this.getAttribute("tabName"); }
  get imgSrc() { return this.getAttribute("imgSrc"); }
  get tooltip() { return this.getAttribute("tooltip"); }

  set tabName(value) { this.setAttribute("tabName", value); }
  set imgSrc(value) { this.setAttribute("imgSrc", value); }
  set tooltip(value) { this.setAttribute("tooltip", value); }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {
    this.$tab.id = this.tabName;
    this.$img.src = this.imgSrc;
    this.$tooltip.innerHTML = this.tooltip;
  }
}

window.customElements.define('nav-tab', NavTab);