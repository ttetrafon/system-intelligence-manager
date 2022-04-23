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
        <select id="role-selector">
          <option value="GM">GM</option>
          <option value="player">Player</option>
        </select>
      </td>
    </tr>
    <tr>
      <td class="right-sided">Selected Game</td>
      <td class="control"><select id="game-selector"></select></td>
    </tr>
    <tr>
      <td class="right-sided">Create New Game</td>
      <td class="control">
        <input-field id="new-game-name-input"
          type="user"
          target="user.gamesList"
          placeholder="new game name"
        ></input-field>
      </td>
    </tr>
  </tbody>
</table>
`;

// TODO: create all input fields as components, and emit events with details:
// {
//    type: "..." (creature, user, world, etc)
//    target: ['user', 'userName'],
//    value: "..."
// }
// store the incoming target as 'user.userName', so that properties of arbitrary length can be easily parsed by using split('.').
// catch these events on the main level, and handle them accordingly

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