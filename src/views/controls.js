const script = "controls.js";
const ARTICLE_SUFFIX = '-article';
const TAB_SUFFIX = '-tab';

export class Controls {
  constructor(state, elements) {
    window.main.log(script, "Started!");

    this.state = state;
    this.el = elements;
  }

  // Choose the current main view tab list and article.
  initialView(currentView) {
    // select the visible view and highlight the appropriate tabs
    this.el[currentView.view + ARTICLE_SUFFIX].classList.add('visible');
    this.el[currentView.category + TAB_SUFFIX].selected = 'selected';
    this.el[currentView.view].selected = 'selected';

    // populate the appropriate data
    this.setViewData(currentView.view);

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

    // then populate the appropriate data
    this.setViewData(this.state.$user.currentView.view);
  }

  setViewData(view) {
    switch(view) {
      case 'user':
        this.el['user-section'].user = this.state.$user;
        break;
    }
  }

  valueChanged(details) {
    switch(details.type) {
      case "user":
        this.handleUserUpdated(details);
        break;
    }
  }

  handleUserUpdated(details) {
    // console.log(`---> handleUserUpdated(${JSON.stringify(details)})`);
    this.updateObjectProperty(this.state.$user, details.target.slice(1), details.value);
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
}
