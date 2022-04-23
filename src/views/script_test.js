import './components/user-section.js';
import './components/input-field.js';
import './components/input-selector.js';

const main = document.querySelector("main");
main.addEventListener('valueChanged', event => {
  console.log("input value changed event captured:", event.detail);
});

const article = document.querySelector("article");
article.classList.add("visible");

const userSection = document.querySelector("user-section");
userSection.user = {
  userName: "nakis",
  userRole: "GM",
  gamesList: ["YADTS", "DnD 5e"],
  activeGame: "YADTS"
};
