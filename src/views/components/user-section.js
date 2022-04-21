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
      <td class="control"><input id="username-input" placeholder="username" type="text"></td>
      <td>
        <button class="btn-small">&#9745;</button>
        <button class="btn-small">&#9746;</button>
      </td>
    </tr>
    <tr>
      <td class="right-sided">Role</td>
      <td class="control">
        <select id="role-selector">
          <option value="GM">GM</option>
          <option value="player">Player</option>
        </select>
      </td>
      <td>
        <button class="btn-small">&#9745;</button>
        <button class="btn-small">&#9746;</button>
      </td>
    </tr>
    <tr>
      <td class="right-sided">Selected Game</td>
      <td class="control"><select id="game-selector"></select></td>
      <td>
        <button class="btn-small">&#9745;</button>
        <button class="btn-small">&#9746;</button>
      </td>
    </tr>
    <tr>
      <td class="right-sided">Create New Game</td>
      <td class="control"><input  id="new-game-name-input" placeholder="new game name" type="text"></td>
      <td>
        <button class="btn-small" class="confirm">&#9745;</button>
        <button class="btn-small" class="cancel">&#9746;</button>
      </td>
    </tr>
  </tbody>
</table>
`;

// TODO: make the two confirm/cancel buttons a component!

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
        this.$usernameInput.value = this.user.userName;
        this.$roleSelector.value = this.roleOptions.includes(this.user.userRole) ? this.user.userRole : "player";
        for (let i = 0; i < this.user.gamesList.length; i++) {
          var opt = document.createElement("option");
          opt.value = this.user.gamesList[i];
          opt.innerHTML = this.user.gamesList[i];
          this.$gameSelector.appendChild(opt);
        }
        this.$gameSelector.value = this.user.activeGame;
    }
  }

}

window.customElements.define('user-section', UserSection);