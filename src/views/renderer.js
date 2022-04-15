const script = "renderer.js";
import { Controls } from './controls.js';
import { ids } from './ids.js';

window.main.log([script, "Started!"]);

// Collect all the elements in the page and create all appropriate lists.
const idList = [];
idList.push(...ids.tabs, ...ids.articles);
const el = {};
for (let i = 0; i < idList.length; i++) {
  el[idList[i]] = document.getElementById(idList[i]);
}
const tabs = ids.tabs.map((tab) => { return el[tab] });

// Initialise modules
const controls = new Controls();

// Set the interface controls
controls.linkTabsAndViews(tabs, ids.articles, el);




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
