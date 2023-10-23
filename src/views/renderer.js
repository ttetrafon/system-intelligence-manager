// Main renderer script. Controls all functionality and handles all event relevant to a specific application window.
const script = "renderer.js";
import './components/attribute-item.js';
import './components/attributes-section.js';
import './components/checks-section.js';
import './components/checks-subsection.js';
import './components/editable-field.js';
import './components/input-field.js';
import './components/input-selector.js';
import './components/nav-tab.js';
import './components/text-editor-button.js';
import './components/text-editor.js';
import './components/user-section.js';
import './components/view-tab.js';
import './diceRoller.js';

import { Controls } from './controls.js';
import { ids } from './ids.js';
import { ViewTabData } from '../data/objects.js';
import { State } from './state.js';

window.main.log(script, "Started!");

// Collect all the elements in the page and create all appropriate lists.
// const idList = [];
// idList.push(
//   ...ids.parents,
//   ...ids.tabs,
//   ...ids.articles,
//   ...ids.sections
// );
// console.log(idList);
// Construct a dictionary of all the web elements in the window, for ease of reference.
// const el = {};
// for (let i = 0; i < idList.length; i++) {
//   el[idList[i]] = document.getElementById(idList[i]);
// }
// console.log("registered elements:", el);


// Initialise modules
// const state = new State();
// const controls = new Controls(state, el);


// Populate and register UI elements programmatically.
// ... dynamically created elements (that will be referenced elsewhere) need to be registered here through the 'registerElements' event.
// document.addEventListener('registerElements', event => { Object.assign(el, event.detail); });
// ... view-tabs are created here
// el['gameSystem-tab'].views = {
//   'checks': new ViewTabData("checks", "Checks", "./UI/buttons/Dice 1.png"),
//   'attributes': new ViewTabData("attributes", "Attributes", "./UI/buttons/Equalizer 2.png")
// };
// el['settings-tab'].views = {
//   user: new ViewTabData("user", "User", "./UI/buttons/User 1.png")
// }


// Register event handlers.
// - communication with the main process
// - current window changes (view displayed, etc)
// - data updates
// Data update events are emitted from he window to main, to store the updated data on the disk, and notify other open windows of the change.
// Data update events from main are required so that a window keeps track of data updates happening in other open windows.

// 'onTabSelected' controls which view will be displayed and is triggered by links throughout the application.
// - event.detail: {
//                    category: The id of the tab category the view is contained within.
//                    view: The id of the view to be displayed
//                 }
// el['nav'].addEventListener("onTabSelected", event => { controls.setView(event.detail); });
// 'valueChanged' is triggered when some data are updated or created.
// - event.detail: {
//                    type: Determines the type of data that needs updating (gameSystem, dictionaries, user, etc).
//                    target: The target property. The target is a list that contains the path to the specified property within any complex object structure.
//                            The first element must correspond to the appropriate '$...' object in state.js.
//                    value: The new value to be stored for the target.
//                 }
// el['main'].addEventListener("valueChanged", event => { controls.valueChanged(event.detail) });
// 'valueDeleted' is triggered when piece of data is deleted.
// - event.detail: {
//                    type: Determines the type of data that needs to be removed.
//                    target: The target property (see above).
//                 }
// el['main'].addEventListener("valueDeleted", event => { controls.valueDeleted(event.detail) });

// 'initialUser' is triggered once from the main process, when the window opens, and includes all user data.
// - user: The user object.
// window.main.receive('initialUser', (user) => {
//   // console.log('... initialUser', user);
//   state.$user = user;
//   controls.initialView(state.$user.currentView);
// });
// 'updateUser' is emitted from the main process whenever some user data has been changed.
// - user: The user object.
// window.main.receive('updateUser', (user) => {
//   // console.log("---> 'updateUser' event received!", user);
//   // ignore changes in currentView, as this will mess up
//   // check if the user data changed, and set appropriate attributes in all articles and controls
//   if (JSON.stringify(state.$user) == JSON.stringify(user)) return;
//   state.$user = user;
//   controls.setArticleData();
// });

// 'initialiseDictionaries' is triggered once from the main process, when the window opens, and includes all dictionary data.
// - dictionaries: Object containing all the system dictionaries.
// window.main.receive('initialiseDictionaries', (dictionaries) => {
//   // console.log("---> 'initialiseDictionaries' event received", dictionaries);
//   state.$names = dictionaries.names;
//   controls.setArticleData();
// });
// 'updateDictionaries' is emitted from the main process whenever some dictionary data has been changed.
// - part: The specific dictionary to be updated (check state.js for the specific names).
// - data: The new data structure.
// window.main.receive('updateDictionaries', (part, data) => {
//   // console.log("---> 'updateDictionaries' event received", part, data);
//   if (JSON.stringify(state["$" + part]) == JSON.stringify(data)) return;
//   state["$" + part] = data;
//   controls.setArticleData();
// });

// 'initialGameSystem' is triggered once from the main process, when the window opens, and includes all gamy system data.
// window.main.receive('initialGameSystem', (gameSystemData) => {
//   // console.log("---> 'initialGameSystem' event received", gameSystemData);
//   state.$checks = gameSystemData.checks;
//   state.$attributes = gameSystemData.attributes;
//   controls.setArticleData();
// });
// 'updateGameSystem' is emitted from the main process whenever some game system data has been changed.
// - part: The specific game system data structure to be updated (check state.js for the specific names).
// - data: The new data structure.
// window.main.receive('updateGameSystem', (part, data) => {
//   // console.log("---> 'updateGameSystem' event received", part, data);
//   if (JSON.stringify(state["$" + part]) == JSON.stringify(data)) return;
//   state["$" + part] = data;
//   controls.setArticleData();
// });



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
