import './components/user-section.js';

const article = document.querySelector("article");
article.classList.add("visible");

const userSection = document.querySelector("user-section");
userSection.user = {
  userName: "nakis",
  userRole: "GM",
  gamesList: ["YADTS", "DnD 5e"],
  activeGame: "YADTS"
};