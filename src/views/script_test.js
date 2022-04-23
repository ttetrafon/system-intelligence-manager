import './components/checks-section.js';
import './components/input-field.js';
import './components/input-selector.js';
import './components/text-editor.js';
import './components/text-editor-button.js';

const main = document.querySelector("main");
main.addEventListener('valueChanged', event => {
  console.log("input value changed event captured:", event.detail);
});

const article = document.querySelector("article");
article.classList.add("visible");

const section = document.querySelector("checks-section");
section.checks = {
  intro: "An introduction to checks!"
};