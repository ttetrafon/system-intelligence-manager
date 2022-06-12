import './components/attribute-item.js';
import './components/attributes-section.js';
import './components/checks-section.js';
import './components/checks-subsection.js';
import './components/editable-field.js';
import './components/input-field.js';
import './components/input-selector.js';
import './components/nav-tab.js';
import './components/text-editor.js';
import './components/text-editor-button.js';
import './components/user-section.js';
import './components/view-tab.js';
import './diceRoller.js';
import { DiceRoller } from './diceRoller.js';

const main = document.querySelector("main");
main.addEventListener('valueChanged', event => {
  console.log("input value changed event captured:", event.detail);
});

const names = {
  "3194d5e9-f8fe-4c05-a085-18e2efeb559c": "Might",
  "180b2afa-eae3-4843-b03e-3a13b91aa67a": "Agility"
};

const article = document.querySelector("article");
article.classList.add("visible");


const section = document.querySelector("attributes-section");
section.user_role = "GM";
section.names = names;
section.attributes = {
  intro: "An intro to attributes...",
  attributes: [
    {
      uid: "3194d5e9-f8fe-4c05-a085-18e2efeb559c",
      mod: "MIG",
      description: "You are mighty!"
    },
    {
      uid: "180b2afa-eae3-4843-b03e-3a13b91aa67a",
      mod: "AGI",
      description: "You are agile!"
    }
  ]
};


// const section = document.querySelector("checks-section");
// const checks = {
//   // intro: "#1An introduction to checks!\n#2#4This is some example text!\n   And even more text 1...\n#3#1And even more text 2..."
//   // intro: "#2#4This is some example text!"
//   // intro: "Some **text** //with **nothing// serious going** on...\nlist end!"
//   intro: "#1 A list!\n1. Item 1\n1. Item 2\n1. Item 3\nNo more list!",
//   mainUsed: true,
//   mainName: "Attribute Checks",
//   mainDescription: "This is the description of the attribute checks!",
//   secondaryUsed: true,
//   secondaryName: "Single Die",
//   secondaryDescription: "This is the description of the single die mechanic!"
// };
// section.checks = checks;
// section.user_role = "GM";
// const dr = new DiceRoller();
// dr.initialiseDiceRoller();
// dr.check({
//   numberInGroup: 4,
//   bonus: 1,
//   penalty: 0,
//   target: 11,
//   difficulty: 2
// });

