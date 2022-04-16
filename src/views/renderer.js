const script = "renderer.js";
import './components/nav-tab.js';
import { Controls } from './controls.js';
import { ids } from './ids.js';
import { State } from './state.js';

window.main.log([script, "Started!"]);

// Collect all the elements in the page and create all appropriate lists.
const idList = [];
idList.push(ids.parents, ...ids.articles);
const el = {};
for (let i = 0; i < idList.length; i++) {
  el[idList[i]] = document.getElementById(idList[i]);
}
console.log("registered elements:", el);

// Initialise modules
const state = new State();
const controls = new Controls(state);

// Set the interface controls
el.nav.addEventListener("onTabSelected", event => {
  controls.setView(el, event.detail);
});
controls.initialView(el, state.$currentView);




// linkButton: document.getElementById('btn-link')
// elements.linkButton.addEventListener('click', () => {
//   window.main.openLink("https://www.fantasynamegenerators.com/")
// });

// const setButton = document.getElementById('btn')
// const titleInput = document.getElementById('title')
// setButton.addEventListener('click', () => {
//   const title = titleInput.value;
//   window.main.setTitle(title);
// });

// const btn_of = document.getElementById('btn-of')
// const filePathElement = document.getElementById('filePath')
// btn_of.addEventListener('click', async () => {
//   const filePath = await window.main.openFile();
//   filePathElement.innerText = filePath;
// });
