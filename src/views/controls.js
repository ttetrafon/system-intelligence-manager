const script = "controls.js";
const ARTICLE_SUFFIX = '-article';
const SECTION_SUFFIX = '-section';
const TAB_SUFFIX = '-tab';

export class Controls {
  constructor(state, elements) {
    window.main.log(script, "Started!");

    this.state = state;
    this.el = elements;
  }

  // Choose the current main view tab list and article.
  initialView(currentView) {
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
    // if (view.view === this.state?.$user?.currentView?.view) return;

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
    let view = this.state.$user.currentView.view;
    switch(view) {
      case 'attributes':
        this.el[view + SECTION_SUFFIX].user_role = this.state.$user.userRole;
        this.el[view + SECTION_SUFFIX].names = this.state.$names;
        this.el[view + SECTION_SUFFIX].attributes = this.state.$attributes;
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
    switch(details.type) {
      case "user":
        this.handleUserUpdated(details);
        break;
      case "gameSystem":
        this.handleGameSystemUpdated(details);
        break;
      default:
        window.main.log(script, `valueChanged(${JSON.stringify(details)}): not handled`);
    }
    this.setArticleData();
  }

  valueDeleted(details) {
    switch(details.type) {
      case "gameSystem":
        this.handleGameSystemDeletion(details);
        break;
    }
  }

  handleGameSystemUpdated(details) {
    // console.log(`---> handleGameSystemUpdated(${JSON.stringify(details)})`);
    let eventTarget = details.target.shift();
    this.updateObjectProperty(this.state.$user, details.target, details.value);
    window.main.updateGameSystem(target, data);(eventTarget.substring(1), this[eventTarget]);
  }

  handleGameSystemDeletion(details) {
    // console.log(`---> handleGameSystemDeletion(${JSON.stringify(details)})`);
    let eventTarget = details.target.shift();
    this.removeObjectProperty(this.state.$user, details.target, details.value);
    window.main.updateGameSystem(target, data);(eventTarget.substring(1), this[eventTarget]);
  }

  handleUserUpdated(details) {
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
    if (prop.length == 0) return obj;
    else return this.getObjectProperty(obj[prop.shift()], prop);
  }
  updateObjectProperty(obj, prop, value) {
    // console.log("---> updateObjectProperty(obj, prop, value)", obj, prop, value);
    if (prop.length == 1) obj[prop] = value;
    else return this.updateObjectProperty(obj[prop.shift()], prop, value);
  }
  removeObjectProperty(obj, prop, value) {
    // console.log("---> removeObjectProperty(obj, prop, value)", obj, prop, value);
    if (prop.length == 1) delete obj[prop];
    else return this.updateObjectProperty(obj[prop.shift()], prop, value);
  }
}
