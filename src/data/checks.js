class Checks {
  // Game System -> checks

  constructor() {
    this.intro = "Introduction on how checks work in the game.";
    this.mainUsed = true;
    this.mainName = "Main Resolution Mechanics";
    this.mainDescription = "Introduction on how the main resolution system works.";
    this.secondaryUsed = true;
    this.secondaryName = "Secondary Resolution Mechanics";
    this.secondaryDescription = "Introduction on how the secondary resolution system works.";
  }

  initialise(obj) {
    // console.log(`---> initialiseChecks(${JSON.stringify(obj)})`);
    if (obj["intro"]) this.intro = obj["intro"];
    if (obj["mainUsed"]) this.mainUsed = obj["mainUsed"];
    if (obj["mainName"]) this.mainName = obj["mainName"];
    if (obj["mainDescription"]) this.mainDescription = obj["mainDescription"];
    if (obj["secondaryUsed"]) this.secondaryUsed = obj["secondaryUsed"];
    if (obj["secondaryName"]) this.secondaryName = obj["secondaryName"];
    if (obj["secondaryDescription"]) this.secondaryDescription = obj["secondaryDescription"];
  }
}

module.exports = Checks;