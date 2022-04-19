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
    // console.log(`---> initialView(${currentView})`);
    // Set the tab list and the view.
    el[currentView.category + TAB_LIST].classList.toggle('visible');
    el[currentView.view + ARTICLE_SUFFIX].classList.toggle('visible');
    // 'Select' the appropriate main and secondary tabs.
    el[currentView.category + TAB_SUFFIX].selected = "selected";
    el[currentView.view + TAB_SUFFIX].selected = "selected";
    // Finally set the window title according to the choices above.
    window.main.setTitle();
  }

  setSecondaryTabs(el, category) {
    // console.log(`---> setSecondaryTabs(${category})`);
    if (category === this.state.$user.currentView.category) return;
    // first hide the currently open tab list and unselect the current main tab
    el[this.state.$user.currentView.category + TAB_LIST].classList.toggle('visible');
    el[this.state.$user.currentView.category + TAB_SUFFIX].selected = null;
    // then assign the newly selected tab list in the state
    this.state.$user.currentView.category = category;
    // console.log(this.state.$user.currentView);
    // finally show the newly selected tab list and select the clicked main tab
    el[this.state.$user.currentView.category + TAB_LIST].classList.toggle('visible');
    el[this.state.$user.currentView.category + TAB_SUFFIX].selected = "selected";
    // console.log(currentView.category + TAB_LIST, el[this.state.$user.currentView.category + TAB_LIST].classList);
  }

  setView(el, view) {
    console.log(`---> setView(${view})`);
    if (view === this.state.$user.currentView.view) return;
    // first hide the currently open view and unselect the current secondary tab
    el[this.state.$user.currentView.view + ARTICLE_SUFFIX].classList.toggle('visible');
    el[this.state.$user.currentView.view + TAB_SUFFIX].selected = null;
    // then assign the newly selected view in the state
    this.state.$user.currentView.view = view;
    // then show the newly selected tab list and select the clicked main tab
    el[this.state.$user.currentView.view + ARTICLE_SUFFIX].classList.toggle('visible');
    el[this.state.$user.currentView.view + TAB_SUFFIX].selected = 'selected';
    // finally save the current selection in the user properties
    window.main.updateUser(this.state.$user);
    window.main.setTitle();
  }

}
