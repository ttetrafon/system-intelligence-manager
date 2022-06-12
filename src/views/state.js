const script = "state.js";

export class State {
  constructor() {
    window.main.log(script, "Started!");

    // General data
    this.$user = {
      userName: "username",
      userRole: "GM",
      currentView: {
        category: "settings",
        view: "user"
      },
      gamesList: ['YADTS'],
      activeGame: 'YADTS'
    };

    // Game System data
    this.$checks = {
      intro: "..."
    };
    this.$attributes = {
      intro: "...",
      attributes: {},
      order: []
    };

    // Entities data
  }

}
