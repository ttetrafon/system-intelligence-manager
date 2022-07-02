const script = "controls.js";
// The suffixes are used to dynamically create element ids (ids.js).
const ARTICLE_SUFFIX = '-article';
const SECTION_SUFFIX = '-section';
const TAB_SUFFIX = '-tab';

export class Controls {
  // Collection of all functionality concerning state and events.
  // NOTE: Maybe move these in the state.js???

  constructor(state, elements) {
    window.main.log(script, "Started!");

    this.state = state;
    this.el = elements;
  }

  initialView(currentView) {
    // Selects the current view depending on the incoming user data.
    // - currentView: { category: "...", view: "..." }
    // console.log(`initialView(${JSON.stringify(currentView)})`);
    // select the visible view and highlight the appropriate tabs
    this.el[currentView.view + ARTICLE_SUFFIX].classList.add('visible');
    this.el[currentView.category + TAB_SUFFIX].selected = 'selected';
    this.el[currentView.view].selected = 'selected';

    // populate the appropriate data
    this.setArticleData();

    // and set the window title according to the choices above
    window.main.setTitle();
  }

  setView(view) {
    // Changes the view when the appropriate event is triggered.
    // - view: { category: "...", view: "..." }
    if (view.view === this.state?.$user?.currentView?.view) return;

    // first hide the currently open view and unselect the current tabs
    if (this.state.$user?.currentView?.view) {
      this.el[this.state.$user.currentView.view + ARTICLE_SUFFIX].classList.remove('visible');
      this.el[this.state.$user.currentView.category + TAB_SUFFIX].selected = null;
      this.el[this.state.$user.currentView.view].selected = null;
    }

    // apply the new selection in state and update the user
    // this.state.$user.currentView = view;
    this.handleUserUpdated({
      target: ['user', 'currentView'],
      value: view
    });

    // then show the newly selected view and highlight the active tabs
    this.el[this.state.$user.currentView.view + ARTICLE_SUFFIX].classList.add('visible');
    this.el[this.state.$user.currentView.category + TAB_SUFFIX].selected = 'selected';
    this.el[this.state.$user.currentView.view].selected = 'selected';
  }

  setArticleData() {
    // Updates the current view with the appropriate, up-to-date data.
    // console.log("---> setArticleData()");
    let view = this.state.$user.currentView.view;
    switch(view) {
      case 'attributes':
        this.el[view + SECTION_SUFFIX].user_role = this.state.$user.userRole;
        this.el[view + SECTION_SUFFIX].names = this.state.$names;
        // console.log((view + SECTION_SUFFIX), this.state.$attributes);
        this.el[view + SECTION_SUFFIX].attributeData = this.state.$attributes;
      case 'checks':
        this.el[view + SECTION_SUFFIX].user_role = this.state.$user.userRole;
        this.el[view + SECTION_SUFFIX].checks = this.state.$checks;
        break;
      case 'user':
        this.el[view + SECTION_SUFFIX].user = this.state.$user;
        break;
    }
  }

  valueChanged(details) {
    // Delegates a 'valueChanged' event to the appropriate handler depending on the 'details.type' value.
    // This is called from he renderer.js when a 'valueChanged' event is intercepted.
    // console.log(`---> valueChanged(${JSON.stringify(details)})`);
    switch(details.type) {
      case "dictionary":
        this.handleDictionaryUpdated(details);
        break;
      case "gameSystem":
        this.handleGameSystemUpdated(details);
        break;
      case "user":
        this.handleUserUpdated(details);
        break;
      default:
        window.main.log(script, `valueChanged(${JSON.stringify(details)}): not handled`);
    }
    this.setArticleData();
  }

  valueDeleted(details) {
    // Delegates a 'valueDeleted' event to the appropriate handler depending on the 'details.type' value.
    // This is called from he renderer.js when a 'valueDeleted' event is intercepted.
    // console.log(`---> valueDeleted(${JSON.stringify(details)})`);
    switch(details.type) {
      case "gameSystem":
        this.handleGameSystemDeletion(details);
        break;
    }
  }

  handleDictionaryUpdated(details) {
    // Handles updating/creating a specific dictionary value.
    // - details: { type: "...", target: ["...", "...", ...], value: "..." }
    console.log(`---> handleDictionaryUpdated(${JSON.stringify(details)})`);
    let eventTarget = details.target.shift();
    this.updateObjectProperty(this.state[eventTarget], details.target, details.value);
    window.main.updateDictionary(eventTarget.substring(1), this.state[eventTarget]);
  }

  handleGameSystemUpdated(details) {
    // Handles updating/creating a specific game system data piece.
    // - details: { type: "...", target: ["...", "...", ...], value: "..." }
    // console.log(`---> handleGameSystemUpdated(${JSON.stringify(details)})`);
    let eventTarget = details.target.shift();
    if (details.target.length > 0) this.updateObjectProperty(this.state[eventTarget], details.target, details.value);
    else this.state[eventTarget] = details.value;
    window.main.updateGameSystem(eventTarget.substring(1), this.state[eventTarget]);
  }

  handleGameSystemDeletion(details) {
    // Handles deleting a specific game system data piece.
    // - details: { type: "...", target: ["...", "...", ...] }
    // console.log(`---> handleGameSystemDeletion(${JSON.stringify(details)})`);
    let eventTarget = details.target.shift();
    this.updateObjectProperty(this.state[eventTarget], details.target, details.value);
    window.main.updateGameSystem(eventTarget.substring(1), this.state[eventTarget]);
  }

  handleUserUpdated(details) {
    // Handles updating/creating a specific user data piece.
    // console.log(`---> handleUserUpdated(${JSON.stringify(details)})`);
    this.updateObjectProperty(this.state.$user, details.target.slice(1), details.value);
    if (details.target.includes('activeGame') && !this.state.$user.gamesList.includes(details.value)) {
      this.state.$user.gamesList.push(details.value);
      this.state.$user.gamesList.sort();
    }
    // console.log(this.state.$user);
    window.main.updateUser(this.state.$user);
    window.main.setTitle();
  }


  getObjectProperty(obj, prop) {
    // Recursively find a specific property, by searching with its address within he object.
    // - obj: Link to the object to search for the property.
    // - prop: A list that describes the address of the property within the object.
    if (prop.length == 0) return obj;
    else {
      let tt = prop[0];
      if (!obj[tt]) {
        // If some part of the address is missing, then stop and return undefined.
        return undefined;
      }
      return this.getObjectProperty(obj[prop.shift()], prop);
    }
  }
  updateObjectProperty(obj, prop, value) {
    // Recursively find a specific property, by searching with its address within he object, and update its value.
    // - obj: Link to the object to search for the property.
    // - prop: A list that describes the address of the property within the object.
    // - value: The new value to be assigned to the specified property.
    // console.log("---> updateObjectProperty(obj, prop, value)", obj, prop, value);
    if (prop.length == 1) obj[prop] = value;
    else {
      // First check if the current path within the object already exists.
      let tt = prop[0];
      if (!obj[tt]) {
        // If part of the address is missing, recreate it as an empty object, until reaching the requested property.
        obj[tt] = {};
      }
      // Then move one step forward on the path.
      return this.updateObjectProperty(obj[prop.shift()], prop, value);
    }
  }
  removeObjectProperty(obj, prop, value) {
    // Recursively find a specific property, by searching with its address within he object.
    // - obj: Link to the object to search for the property.
    // - prop: A list that describes the address of the property within the object.
    // console.log("---> removeObjectProperty(obj, prop, value)", obj, prop, value);
    if (prop.length == 1) delete obj[prop];
    else {
      let tt = prop[0];
      if (!obj[tt]) {
        // If part of the address is missing, the property does exist already and does not need to be removed.
        return;
      }
      return this.updateObjectProperty(obj[prop.shift()], prop, value);
    }
  }
}
