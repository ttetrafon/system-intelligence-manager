const template = document.createElement('template');

template.innerHTML = `
<style>
  #edit {
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  #controls {
    height: 30px;
    flex: 0;
    background-color: var(--colour_back_medium);
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 5px;
    gap: 5px;
  }

  button {
    width: 25px;
    height: 25px;
    background-color: var(--colour_back_light);
    cursor: pointer;
  }
  button:hover {
    border: var(--colour_title) solid 2px;
  }

  .separator {
    width: 5px;
  }

  img {
    width: 100%;
    height: 95%;
  }

  textarea {
    padding: 10px;
    resize: none;
  }

</style>

<section id="edit">
  <div id="controls">
    <button id="title"><img src="./UI/buttons/Editor - title.png" /></button>
    <span class="separator"></span>
    <button id="bold"><img src="./UI/buttons/Editor - bold.png" /></button>
    <button id="italic"><img src="./UI/buttons/Editor - italic.png" /></button>
    <span class="separator"></span>
    <button id="checklist"><img src="./UI/buttons/Editor - checklist.png" /></button>
    <button id="ordered-list"><img src="./UI/buttons/Editor - ordered list.png" /></button>
    <button id="unordered-list"><img src="./UI/buttons/Editor - unordered list.png" /></button>
    <span class="separator"></span>
    <button id="link"><img src="./UI/buttons/Editor - link.png" /></button>
    <button id="image"><img src="./UI/buttons/Editor - image.png" /></button>
    <span class="separator"></span>
    <button id="align-left"><img src="./UI/buttons/Editor - align left.png" /></button>
    <button id="align-centre"><img src="./UI/buttons/Editor - align centre.png" /></button>
    <button id="align-right"><img src="./UI/buttons/Editor - align right.png" /></button>
    <button id="justify"><img src="./UI/buttons/Editor - justify.png" /></button>
    <span class="separator"></span>
    <button id="indent-increase"><img src="./UI/buttons/Editor - indent increase.png" /></button>
    <button id="indent-decrease"><img src="./UI/buttons/Editor - indent decrease.png" /></button>
  </div>
  <textarea
    spellcheck="false"
    autocomplete="off"
    autofocus
  >## Create Your Markdown</textarea>
</section>
<section id="view">
  <div></div>
  <div id="contents"></div>
</section>
`;

class TextEditor extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$editor = this._shadow.querySelector("textarea");
    this.$content = this._shadow.getElementById("contents");
  }

  static get observedAttributes() {
    return [ "userRole", "text" ];
  }

  get userRole() { return this.getAttribute("userRole"); }
  get text() { return this.getAttribute("text"); }

  set userRole(value) { this.setAttribute("userRole", value); }
  set text(value) { this.setAttribute("text", value); }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch(property) {
      case "text":
        this.$editor.value = this.text;
        this.displayText();
        break;
      case "userRole":
        this.$intro.userRole = this.userRole;
        break;
    }
  }

  async displayText() {

    this.$content.innerHTML = this.text;
  }
}

window.customElements.define('text-editor', TextEditor);