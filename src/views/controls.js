// const script = "controls.js";
// window.main.log([script, "Started!"]);

export class Controls {
  constructor() {
    // console.log("---> Controls()");
  }

  linkTabsAndViews(tabs, articles, elements) {
    // console.log("---> LinkTabsAndViews()");
    for (let i = 0; i < tabs.length; i++) {
      this.setTab(tabs[i], articles, elements);
    }
  }

  setTab(tab, articles, elements) {
    // console.log("---> setTab(" + tab.id + ")");
    tab.addEventListener('click', () => {
      // console.log(tab, articles, elements);
      let articleName = tab.id.substring(0, tab.id.lastIndexOf("-", )) + "-article";
      // console.log(articleName);
      // console.log(elements);
      for (let i = 0; i < articles.length; i++) {
        // console.log(elements[articles[i]].classList);
        elements[articles[i]].classList.remove('visible');
        elements[articles[i]].classList.add('hidden');
      }
      elements[articleName].classList.add('visible');
      elements[articleName].classList.remove('hidden');
    });
  }

}
