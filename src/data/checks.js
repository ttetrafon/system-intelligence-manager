class Checks {
  constructor() {
    this.intro = "Introduction on how checks work in the game.";
  }

  initialiseChecks(obj) {
    console.log(`---> initialiseChecks(${JSON.stringify(obj)})`);
    if (obj["intro"]) this.intro = obj["intro"];
  }
}

module.exports = Checks;