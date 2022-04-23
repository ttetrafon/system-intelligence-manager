const template = document.createElement('template');

template.innerHTML = `
<style>
  #edit {
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  #controls {
    position: relative;
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

  .separator {
    width: 5px;
  }

  button {
    position: absolute;
    right: 15px;
    font-size: 0.95rem;
    border: none;
    border-radius: 25%;
    background: none;
    font-weight: bold;
    color: var(--colour_controls);
    cursor: pointer;
    display: none;
  }
  button:hover {
    border-left: var(--colour_title) solid 2px;
    border-right: var(--colour_title) solid 2px;
    margin-left: -2px;
    margin-right: -2px;
  }

  #confirm-btn {
    margin-top: -2px;
    top: 0;
  }

  #cancel-btn {
    margin-bottom: -2px;
    bottom: 0;
  }

  .active {
    display: block;
  }

  textarea {
    padding: 10px;
    resize: vertical;
    height: 10rem;
  }

  #contents p {
    font-size: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
</style>

<section id="edit">
  <div id="controls">
    <text-editor-button id="title" tooltip="Title" image="./UI/buttons/Editor - title.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="bold" tooltip="Bold" image="./UI/buttons/Editor - bold.png"></text-editor-button>
    <text-editor-button id="italic" tooltip="Italic" image="./UI/buttons/Editor - italic.png"></text-editor-button>
    <text-editor-button id="underlined" tooltip="Underlined" image="./UI/buttons/Editor - underline.png"></text-editor-button>
    <text-editor-button id="strikethrough" tooltip="Strikethrough" image="./UI/buttons/Editor - strikethrough.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="indentIncrease" tooltip="Increase Indent" image="./UI/buttons/Editor - indent increase.png"></text-editor-button>
    <text-editor-button id="indentDecrease" tooltip="Decrease Indent" image="./UI/buttons/Editor - indent decrease.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="checklist" tooltip="Checklist" image="./UI/buttons/Editor - checklist.png"></text-editor-button>
    <text-editor-button id="orderedList" tooltip="Numbered List" image="./UI/buttons/Editor - ordered list.png"></text-editor-button>
    <text-editor-button id="unorderedList" tooltip="Bulleted List" image="./UI/buttons/Editor - unordered list.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="link" tooltip="Insert Link" image="./UI/buttons/Editor - link.png"></text-editor-button>
    <text-editor-button id="image" tooltip="Insert Image" image="./UI/buttons/Editor - image.png"></text-editor-button>
    <text-editor-button id="quote" tooltip="Insert Quote" image="./UI/buttons/Editor - quote.png"></text-editor-button>
    <text-editor-button id="note" tooltip="Insert Note" image="./UI/buttons/Editor - note.png"></text-editor-button>
    <span class="separator"></span>
    <text-editor-button id="alignLeft" tooltip="Align Left" image="./UI/buttons/Editor - align left.png"></text-editor-button>
    <text-editor-button id="alignCentre" tooltip="Align Centre" image="./UI/buttons/Editor - align centre.png"></text-editor-button>
    <text-editor-button id="alignRight" tooltip="Align Right" image="./UI/buttons/Editor - align right.png"></text-editor-button>
    <text-editor-button id="justify" tooltip="Justify Content" image="./UI/buttons/Editor - justify.png"></text-editor-button>
    <span class="separator"></span>
    <button id="confirm-btn">&#9745;</button>
    <button id="cancel-btn">&#9746;</button>
    </div>
  <textarea
    spellcheck="false"
    autocomplete="off"
    autofocus
  >## Create Your Markdown</textarea>
</section>
<section id="view">
  <div></div>
  <div id="contents">
    <h1>A Title</h1>
    <p>## Create Your Markdown</p>
  </div>
</section>
`;

class TextEditor extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.$editor = this._shadow.querySelector("textarea");
    this.$content = this._shadow.getElementById("contents");
    this.$controls = this._shadow.getElementById("controls");
    this.$confirm = this._shadow.getElementById("confirm-btn");
    this.$cancel = this._shadow.getElementById("cancel-btn");

    this.selectionStyles = ['bold', 'italic', 'underlined', 'strikethrough', 'quote'];
    this.startOfLineStyles = ['title', 'title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'checklist', 'orderedList', 'unorderedList', 'alignLeft', 'alignCentre', 'alignRight', 'justify'];
    this.stylingSymbols = {
      title: "#",
      title1: "#1",
      title2: "#2",
      title3: "#3",
      title4: "#4",
      title5: "#5",
      title6: "#6",
      bold: "**",
      italic: "//",
      underlined: "__",
      strikethrough: "--",
      indentIncrease: "",
      indentDecrease: "",
      checklist: "",
      orderedList: "1.",
      unorderedList: "..",
      link: "",
      image: "",
      quote: "''",
      note: "",
      alignLeft: "",
      alignCentre: "",
      alignRight: "",
      justify: ""
    }

    this.$editor.addEventListener("keyup", event => {
      console.log(event.key);
      if (this.text != this.$editor.value) this.showButtons();
      else this.hideButtons();
    });
    this.$controls.addEventListener("editorButton", ({detail}) => {
      // console.log("editor button clicked: ", detail.id);
      // check if something is selected, and apply the style there if appropriate
      let selStart = this.$editor.selectionStart;
      let selEnd = this.$editor.selectionEnd;
      let selDirection = this.$editor.selectionDirection;
      let symbol = this.stylingSymbols[detail.id];
      let symbolLength = symbol.length;
      let symbolLenMultiplier = 1;
    if (this.selectionStyles.includes(detail.id) && (selEnd != selStart)) {
        symbolLenMultiplier = 2;
        let partStart = this.$editor.value.substring(0, selStart);
        let partSel = this.$editor.value.substring(selStart, selEnd);
        let partEnd = this.$editor.value.substring(selEnd);
        this.$editor.value = partStart + symbol + partSel + symbol + partEnd;
        // set the cursor to the appropriate place and focus to the editor window again
        this.$editor.focus();
        this.$editor.selectionEnd = (selDirection == 'forward' ? selEnd + (symbolLenMultiplier * symbolLength) : selStart + symbolLength);
      }
      else if (this.startOfLineStyles.includes(detail.id)) {
        // find the start of the line
        let newLines = [];
        let pos = selStart;
        let nl = this.$editor.value.lastIndexOf("\n", pos);
        newLines.push(nl >= 0 ? nl : 0);
        while(pos < selEnd) {
          nl = this.$editor.value.indexOf("\n", pos + 1);
          pos = nl;
          if (nl < 0) break;
          if (nl < selEnd) newLines.push(nl)
          else break;
        }
        for (let i = 0; i < newLines.length; i++) {
          // TODO: Check if similar symbol is already set, and either ignore or replace?
          let loc = (newLines[i] > 0 ? i * symbolLength + newLines[i] + (newLines[0] <= selStart ? 1 : 0) : 0);
          console.log(`... nl = ${newLines[i]}, loc = ${loc}`);
          let partBefore = this.$editor.value.substring(0, loc);
          let partAfter = this.$editor.value.substring(loc);
          this.$editor.value = partBefore + symbol + partAfter;
        }
        this.$editor.focus();
        this.$editor.selectionEnd = (selDirection == 'forward' ? selEnd + (symbolLenMultiplier * symbolLength * newLines.length) : selStart + symbolLength);
        this.$editor.selStart = this.$editor.selectionEnd;
      }
      else {

      }
      if (this.text != this.$editor.value) this.showButtons();
      else this.hideButtons();
    });
    this.$confirm.addEventListener("click", _ => {
      this.dispatchEvent(
        new CustomEvent('valueChanged', {
          bubbles: true,
          composed: true,
          detail: {
            type: this.type,
            target: this.target.split('.'),
            value: this.$editor.value
          }
        })
      );
      this.text = this.$editor.value;
      this.displayText();
    });
    this.$cancel.addEventListener("click", _ => {
      this.$editor.value = this.text;
      this.hideButtons();
    });
  }

  static get observedAttributes() {
    return [ "userRole", "text", "type", "target" ];
  }

  get userRole() { return this.getAttribute("userRole"); }
  get text() { return this.getAttribute("text"); }
  get type() { return this.getAttribute("type"); }
  get target() { return this.getAttribute("target"); }

  set userRole(value) { this.setAttribute("userRole", value); }
  set text(value) { this.setAttribute("text", value); }
  set type(value) { this.setAttribute("type", value); }
  set target(value) { this.setAttribute("target", value); }

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
    // first remove the old elements
    let old = this.$content.childNodes;
    for (let i = old.length - 1; i >= 0; i--) {
      old[i].remove();
    }
    // then create the text again
    let lines = this.text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      // split the lines
      let text = lines[i].trim();
      if (text.length == 0) continue;
      // get the starting symbol(s)
      // create the appropriate element
      let p = document.createElement("p");
      // parse the line for inner formatting
      // assign the final result in the newly created element
      p.innerHTML = text;
      // append the new element
      this.$content.appendChild(p);
    }
  }

  showButtons() {
    this.$confirm.classList.add("active");
    this.$cancel.classList.add("active");
  }

  hideButtons() {
    this.$confirm.classList.remove("active");
    this.$cancel.classList.remove("active");
  }
}

window.customElements.define('text-editor', TextEditor);