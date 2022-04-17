class User {
  constructor() {
    this.userName = "username";
    this.userRole = "GM";
    this.currentView = {
      tabList: "settings",
      view: "user"
    }
  }

  initialiseUser(obj) {
    if (obj["userName"]) this.userName = obj["userName"];
    if (obj["userRole"]) this.userRole = obj["userRole"];
    this.currentView = {};
    if (this.currentView) {
      if (obj["currentView"]["tabList"]) this.currentView.tabList = obj["currentView"]["tabList"];
      if (obj["currentView"]["view"]) this.currentView.view = obj["currentView"]["view"];
    }
  }
};

module.exports = User;