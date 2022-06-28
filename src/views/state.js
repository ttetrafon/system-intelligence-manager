const script = "state.js";

export class State {
  // Comprises the current window state.
  // This state is synchronised between open windows through events (check renderer.js).s

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

    // Dictionaries
    this.$names = {};

    // Game System data
    this.$checks = {
      intro: "...",
      mainUsed: true,
      mainName: "...",
      mainDescription: "...",
      secondaryUsed: false,
      secondaryName: "...",
      secondaryDescription: "..."
    };
    this.$attributes = {
      intro: "...",
      attributes: {},
      order: []
    };

    // Entities data
  }

}
