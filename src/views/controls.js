const script = "controls.js";
const ARTICLE_SUFFIX = '-article';
const TAB_SUFFIX = '-tab';
const TAB_LIST = '-tab-list';

export class Controls {
  constructor(state) {
    window.main.log([script, "Started!"]);

    this.state = state;
  }

  // Choose the current main view tab list and article.
  initialView(el) {
    // console.log(this.state.$currentView);
    // Set the tab list and the view.
    el[this.state.$currentView.tabList + TAB_LIST].classList.toggle('visible');
    el[this.state.$currentView.view + ARTICLE_SUFFIX].classList.toggle('visible');
    // 'Select' the appropriate main and secondary tabs.
    el[this.state.$currentView.tabList + TAB_SUFFIX].selected = "selected";
    el[this.state.$currentView.view + TAB_SUFFIX].selected = "selected";
  }

  setSecondaryTabs(el, tabList) {
    // console.log(`---> setSecondaryTabs(${tabList})`);
    if (tabList === this.state.$currentView.tabList) return;
    // first hide the currently open tab list and unselect the current main tab
    el[this.state.$currentView.tabList + TAB_LIST].classList.toggle('visible');
    el[this.state.$currentView.tabList + TAB_SUFFIX].selected = null;
    // then assign the newly selected tab list in the state
    this.state.$currentView.tabList = tabList;
    // console.log(this.state.$currentView);
    // finally show the newly selected tab list and select the clicked main tab
    el[this.state.$currentView.tabList + TAB_LIST].classList.toggle('visible');
    el[this.state.$currentView.tabList + TAB_SUFFIX].selected = "selected";
    // console.log(this.state.$currentView.tabList + TAB_LIST, el[this.state.$currentView.tabList + TAB_LIST].classList);
  }

  setView(el, view) {
    console.log(`---> setView(${view})`);
    if (view === this.state.$currentView.view) return;
    // first hide the currently open view and unselect the current secondary tab
    el[this.state.$currentView.view + ARTICLE_SUFFIX].classList.toggle('visible');
    el[this.state.$currentView.view + TAB_SUFFIX].selected = null;
    // then assign the newly selected view in the state
    this.state.$currentView.view = view;
    // then show the newly selected tab list and select the clicked main tab
    el[this.state.$currentView.view + ARTICLE_SUFFIX].classList.toggle('visible');
    el[this.state.$currentView.view + TAB_SUFFIX].selected = 'selected';
    // finally save the current selection in the user properties
    // TODO
  }

  // linkTabsAndViews(tabs, articles, elements) {
  //   // console.log("---> LinkTabsAndViews()");
  //   for (let i = 0; i < tabs.length; i++) {
  //     this.setTab(tabs[i], articles, elements);
  //   }
  // }

  // setTab(tab, articles, elements) {
  //   // console.log("---> setTab(" + tab.id + ")");
  //   tab.addEventListener('click', () => {
  //     // console.log(tab, articles, elements);
  //     let articleName = tab.id.substring(0, tab.id.lastIndexOf("-", )) + "-article";
  //     // console.log(articleName);
  //     // console.log(elements);
  //     for (let i = 0; i < articles.length; i++) {
  //       // console.log(elements[articles[i]].classList);
  //       elements[articles[i]].classList.remove('visible');
  //       elements[articles[i]].classList.add('hidden');
  //     }
  //     elements[articleName].classList.add('visible');
  //     elements[articleName].classList.remove('hidden');
  //   });
  // }

}
