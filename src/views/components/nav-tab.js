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

  .selected {
    background-color: var(--colour_back_light);
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
    z-index: 99;
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

  button:hover .tooltip-text {
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
    this.$horizontalTabs = this._shadow.querySelector(".horizontal-tabs");

    this.$tab.addEventListener("click", _ => {
      this.dispatchEvent(
        new CustomEvent((this.type == 'main' ? 'onTabSelected' : 'onViewSelected'), {
          bubbles: true,
          detail: this.$tab.id
        })
      );
    });
  }

  static get observedAttributes() {
    return ['tabName', "imgSrc", "tooltip", "type", "selected"];
  }

  get tabName() { return this.getAttribute("tabName"); }
  get imgSrc() { return this.getAttribute("imgSrc"); }
  get tooltip() { return this.getAttribute("tooltip"); }
  get type() { return this.getAttribute("type"); }
  get selected() { return this.getAttribute("selected"); }

  set tabName(value) { this.setAttribute("tabName", value); }
  set imgSrc(value) { this.setAttribute("imgSrc", value); }
  set tooltip(value) { this.setAttribute("tooltip", value); }
  set type(value) { this.setAttribute("type", value); }
  set selected(value) { this.setAttribute("selected", value); }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {
    // console.log("... render()", this.tabName, this.selected);
    this.$tab.id = this.tabName;
    this.$img.src = this.imgSrc;
    this.$tooltip.innerHTML = this.tooltip;
    if (this.selected == 'selected') {
      this.$tab.classList.add("selected");
    }
    else {
      this.$tab.classList.remove("selected");
    }
  }
}

window.customElements.define('nav-tab', NavTab);