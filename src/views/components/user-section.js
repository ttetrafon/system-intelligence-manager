const template = document.createElement('template');

template.innerHTML = `
<style>
  @import "./styles/headers.css";
  @import "./styles/table.css";
  @import "./styles/controls.css";
</style>

<h1>User Options</h1>

<table>
  <tbody>
    <tr>
      <td class="right-sided">Username</td>
      <td class="control">
        <input-field id="username-input"
          type="user"
          target="user.userName"
          placeholder="username"
        ></input-field>
      </td>
    </tr>
    <tr>
      <td class="right-sided">Role</td>
      <td class="control">
        <input-selector id="role-selector"
          type="user"
          target="user.userRole"
        ></input-selector>
      </td>
    </tr>
    <tr>
      <td class="right-sided">Selected Game</td>
      <td class="control">
        <input-selector id="game-selector"
          type="user"
          target="user.activeGame"
        ></input-selector>
      </td>
    </tr>
    <tr>
      <td class="right-sided">Create New Game</td>
      <td class="control">
        <input-field id="new-game-name-input"
          type="user"
          target="user.activeGame"
          placeholder="new game name"
        ></input-field>
      </td>
    </tr>
  </tbody>
</table>
`;

class UserSection extends HTMLElement {
  constructor() {
    super();

    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.appendChild(template.content.cloneNode(true));

    this.roleOptions = ["GM", "player"];

    this.$usernameInput = this._shadow.getElementById("username-input");
    this.$roleSelector = this._shadow.getElementById("role-selector");
    this.$gameSelector = this._shadow.getElementById("game-selector");
  }

  static get observedAttributes() {
    return [ "user" ];
  }

  get user() { return JSON.parse(this.getAttribute("user")); }

  set user(value) { this.setAttribute("user", JSON.stringify(value)); }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch(property) {
      case "user":
        this.$usernameInput.text = this.user.userName;
        this.$roleSelector.options = {
          selected: this.user.userRole,
          list: this.roleOptions
        }
        this.$gameSelector.options = {
          selected: this.user.activeGame,
          list: this.user.gamesList
        }
    }
  }

}

window.customElements.define('user-section', UserSection);