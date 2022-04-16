const script = "state.js";

export class State {
  constructor() {
    window.main.log([script, "Started!"]);

    this.$currentView = {
      tabList: 'settings',
      view: 'user'
    };
  }

}