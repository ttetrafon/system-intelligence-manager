const template = document.createElement('template');

template.innerHTML = `
<style>
table {
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

</style>

<table>
  <tbody>
    <tr>
      <td>Username</td>
      <td colspan="2"><input type="text"></td>
    </tr>
    <tr>
      <td>Role</td>
      <td colspan="2">
        <select>
          <option value="GM">GM</option>
          <option value="player">Player</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Game</td>
      <td colspan="2"><select></select></td>
    </tr>
    <tr>
      <td>Create New Game</td>
      <td><input type="text"></td>
      <td><button>OK</button></td>
    </tr>
  </tbody>
</table>
`;

class UserSection extends HTMLElement {
  constructor() {
    super();

    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {}

}

window.customElements.define('user-section', UserSection);