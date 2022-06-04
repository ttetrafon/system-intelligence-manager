const script = "renderer.js";
import './components/checks-section.js';
import './components/checks-subsection.js';
import './components/input-field.js';
import './components/input-selector.js';
import './components/nav-tab.js';
import './components/text-editor.js';
import './components/text-editor-button.js';
import './components/user-section.js';
import './components/view-tab.js';

import { Controls } from './controls.js';
import { ids } from './ids.js';
import { ViewTabData } from '../data/objects.js';
import { State } from './state.js';

window.main.log(script, "Started!");

// Collect all the elements in the page and create all appropriate lists.
const idList = [];
idList.push(
  ...ids.parents,
  ...ids.tabs,
  ...ids.articles,
  ...ids.sections
);
// console.log(idList);
const el = {};
for (let i = 0; i < idList.length; i++) {
  el[idList[i]] = document.getElementById(idList[i]);
}
// console.log("registered elements:", el);


// Initialise modules
const state = new State();
const controls = new Controls(state, el);


// Populate and register UI elements programmatically.
document.addEventListener('registerElements', event => { Object.assign(el, event.detail); });
// ... tabs and views
el['gameSystem-tab'].views = {
  'checks': new ViewTabData("checks", "Checks", "./UI/buttons/Dice 1.png")
};
el['settings-tab'].views = {
  user: new ViewTabData("user", "User", "./UI/buttons/User 1.png")
}


// Set the interface controls.
el['nav'].addEventListener("onTabSelected", event => { controls.setView(event.detail); });
el['main'].addEventListener("valueChanged", event => { controls.valueChanged(event.detail) });

window.main.receive('initialUser', (user) => {
  // console.log('... initialUser', user);
  state.$user = user;
  controls.initialView(state.$user.currentView);
});
window.main.receive('updateUser', (user) => {
  // console.log("---> 'updateUser' event received!", user);
  // ignore changes in currentView, as this will mess up
  // check if the user data changed, and set appropriate attributes in all articles and controls
  if (JSON.stringify(state.$user) == JSON.stringify(user)) return;
  state.$user = user;
  controls.setArticleData();
});

window.main.receive('initialGameSystem', (gameSystemData) => {
  // console.log("---> 'initialGameSystem' event received", gameSystemData);
  state.$checks = gameSystemData.checks;
  controls.setArticleData();
});
window.main.receive('updateGameSystem', (part, data) => {
  // console.log("---> 'updateGameSystem' event received", part, data);
  if (JSON.stringify(state["$" + part]) == JSON.stringify(data)) return;
  state["$" + part] = data;
  controls.setArticleData();
});



// window.main.receive('test', (data) => {
//   console.log(`Received '${data}' from main process`);
// });

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
