const script = "state.js";

export class State {
  constructor() {
    window.main.log(script, "Started!");

    this.$user = {};
  }

  getCurrentView() {
    // console.log("---> getCurrentView()", this.$user.currentView);
    return (this.$user.currentView ? this.$user.currentView : {
      tabList: "settings",
      view: "user"
    });
  }

}
