class User {
  constructor() {
    this.userName = "username";
    this.userRole = "GM";
  }

  initialiseUser(obj) {
    this.userName = obj["userName"];
    this.userRole = obj["userRole"];
  }
};

module.exports = User;