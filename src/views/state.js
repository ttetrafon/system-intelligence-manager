const script = "state.js";

export class State {
  constructor() {
    window.main.log(script, "Started!");

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
  }

  getCurrentView() {
    // console.log("---> getCurrentView()", this.$user.currentView);
    return (this.$user.currentView ? this.$user.currentView : {
      category: "settings",
      view: "user"
    });
  }
}
