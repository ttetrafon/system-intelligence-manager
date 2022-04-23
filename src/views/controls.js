const script = "controls.js";
const ARTICLE_SUFFIX = '-article';
const TAB_SUFFIX = '-tab';
const TAB_LIST = '-tab-list';

export class Controls {
  constructor(state) {
    window.main.log(script, "Started!");

    this.state = state;
  }

  // Choose the current main view tab list and article.
  initialView(el, currentView) {
    // select the visible view and highlight the appropriate tabs
    el[currentView.view + ARTICLE_SUFFIX].classList.add('visible');
    el[currentView.category + TAB_SUFFIX].selected = 'selected';
    el[currentView.view].selected = 'selected';

    // populate the appropriate data
    this.setViewData(el, currentView.view);

    // and set the window title according to the choices above
    window.main.setTitle();
  }

  setView(el, view) {
    // if (view.view === this.state?.$user?.currentView?.view) return;

    // first hide the currently open view and unselect the current tabs
    if (this.state.$user?.currentView?.view) {
      el[this.state.$user.currentView.view + ARTICLE_SUFFIX].classList.remove('visible');
      el[this.state.$user.currentView.category + TAB_SUFFIX].selected = null;
      el[this.state.$user.currentView.view].selected = null;
    }

    // then assign the newly selected view in the state
    this.state.$user.currentView = view;

    // then show the newly selected view and highlight the active tabs
    el[this.state.$user.currentView.view + ARTICLE_SUFFIX].classList.add('visible');
    el[this.state.$user.currentView.category + TAB_SUFFIX].selected = 'selected';
    el[this.state.$user.currentView.view].selected = 'selected';

    // then populate the appropriate data
    this.setViewData(el, this.state.$user.currentView.view);

    // finally save the current selection in the user properties
    window.main.updateUser(this.state.$user);
    window.main.setTitle();
  }

  setViewData(el, view) {
    switch(view) {
      case 'user':
        el['user-section'].user = this.state.$user;
        break;
    }
  }

}
