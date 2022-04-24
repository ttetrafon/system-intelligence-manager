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
  intro: "An introduction to checks!\nThis is some example text!\n\nAnd even more text 1...\nAnd even more text 2...\nAnd even more text 3...\nAnd even more text 4...\nAnd even more text 5...\nAnd even more text 6...\nAnd even more text 7...\nAnd even more text 8...\nAnd even more text 9...\nAnd even more text 10...\nAnd even more text 11...\nAnd even more text 12...\nAnd even more text 13...\nAnd even more text 14...\nAnd even more text 15..."
};