const script = "renderer.js";
import './components/nav-tab.js';
import { Controls } from './controls.js';
import { ids } from './ids.js';
import { State } from './state.js';

window.main.log([script, "Started!"]);

// Collect all the elements in the page and create all appropriate lists.
const idList = [];
idList.push(
  ...ids.parents,
  ...ids.tabs,
  ...ids.tabLists,
  ...ids.articles
);
// console.log(idList);
const el = {};
for (let i = 0; i < idList.length; i++) {
  el[idList[i]] = document.getElementById(idList[i]);
}
console.log("registered elements:", el);

// Initialise modules
const state = new State();
const controls = new Controls(state);

// Set the interface controls
el["nav"].addEventListener("onTabSelected", event => { controls.setSecondaryTabs(el, event.detail); });
el["nav"].addEventListener("onViewSelected", event => { controls.setView(el, event.detail); });
controls.initialView(el, state.$currentView);
