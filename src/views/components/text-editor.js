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
    <text-editor-button id="title" tooltip="Title" image="./UI/buttons/Editor - title.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="bold" tooltip="Bold" image="./UI/buttons/Editor - bold.png"></text-editor-button>
    <text-editor-button id="italic" tooltip="Italic" image="./UI/buttons/Editor - italic.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="indent-increase" tooltip="Increase Indent" image="./UI/buttons/Editor - indent increase.png"></text-editor-button>
    <text-editor-button id="indent-decrease" tooltip="Decrease Indent" image="./UI/buttons/Editor - indent decrease.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="checklist" tooltip="Checklist" image="./UI/buttons/Editor - checklist.png"></text-editor-button>
    <text-editor-button id="ordered-list" tooltip="Numbered List" image="./UI/buttons/Editor - ordered list.png"></text-editor-button>
    <text-editor-button id="unordered-list" tooltip="Bulleted List" image="./UI/buttons/Editor - unordered list.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="link" tooltip="Insert Link" image="./UI/buttons/Editor - link.png"></text-editor-button>
    <text-editor-button id="image" tooltip="Insert Image" image="./UI/buttons/Editor - image.png"></text-editor-button>
    <text-editor-button id="quote" tooltip="Insert Quote" image="./UI/buttons/Editor - quote.png"></text-editor-button>
    <text-editor-button id="note" tooltip="Insert Note" image="./UI/buttons/Editor - note.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="align-left" tooltip="Align Left" image="./UI/buttons/Editor - align left.png"></text-editor-button>
    <text-editor-button id="align-centre" tooltip="Align Centre" image="./UI/buttons/Editor - align centre.png"></text-editor-button>
    <text-editor-button id="align-right" tooltip="Align Right" image="./UI/buttons/Editor - align right.png"></text-editor-button>
    <text-editor-button id="justify" tooltip="Justify Content" image="./UI/buttons/Editor - justify.png"></text-editor-button>
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

    this.$editor.addEventListener("keyup", event => {
      console.log(event.key);
    });
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