const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";
</style>

<h1>Checks</h1>
`;

class ChecksSection extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch(property) {
    }
  }
}

window.customElements.define('checks-section', ChecksSection);