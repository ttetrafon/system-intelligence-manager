class User {
  constructor() {
    this.userName = "username";
    this.userRole = "GM";
    this.currentView = {
      category: "settings",
      view: "user"
    };
    this.gamesList = [];
    this.activeGame = "";
  }

  initialiseUser(obj) {
    console.log("---> User.initialiseUser()", obj);
    if (obj["userName"]) this.userName = obj["userName"];
    if (obj["userRole"]) this.userRole = obj["userRole"];
    this.currentView = {};
    if (this.currentView) {
      if (obj["currentView"]["category"]) this.currentView.category = obj["currentView"]["category"];
      if (obj["currentView"]["view"]) this.currentView.view = obj["currentView"]["view"];
    }
    if (obj["gamesList"]) this.gamesList = obj["gamesList"];
    if (obj["activeGame"] && this.gamesList.includes(obj["activeGame"])) this.activeGame = obj["activeGame"];
    else if ((this.activeGame === "") && (this.gamesList.length > 0)) this.activeGame = obj["gamesList"][0];
    else {
      this.gamesList = [ 'YADTS' ];
      this.activeGame = "YADTS";
    }
  }
};

module.exports = User;