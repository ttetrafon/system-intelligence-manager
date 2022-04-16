const script = "state.js";

export class State {
  constructor() {
    window.main.log([script, "Started!"]);

    this.$currentView = 'settings-article'; // TODO: Load this from user settings.
  }

}