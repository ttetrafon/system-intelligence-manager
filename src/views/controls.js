const script = "controls.js";

export class Controls {
  constructor(state) {
    window.main.log([script, "Started!"]);

    this.state = state;
  }

  // Choose the current main view article.
  initialView(el, view) {
    console.log(`---> setView(${view})`);
    console.log(this.state.$currentView);
    el[this.state.$currentView].classList.toggle('visible');
  }

  setView(el, view) {
    console.log(`---> setView(${view})`);
    // first hide the currently open view
    el[this.state.$currentView].classList.toggle('visible');
    // then set the current view to the newly selected one and show it
    this.state.$currentView = view + '-article';
    el[this.state.$currentView].classList.toggle('visible');
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
