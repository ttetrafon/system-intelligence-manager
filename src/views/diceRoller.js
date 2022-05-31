export class DiceRoller {
  constructor() {
    this.resolutionType = "group";
    this.resolution = "under";
    this.diceType = "single";
    this.dice = 20;
    this.bonuses = "diceNumber";

    // functions to be used - determined during initialisation
    this.$check;
    this.$roll;
    this.$resolve;
    this.$applyBonuses
  }

  initialiseDiceRoller() {
    // Build the die roller based on incoming check options.
    // resolution type ('group', 'single'):
    this.$check = this.group;
    // dice type ('specific', 'sequence'):
    this.$roll = this.specificDie;
    // resolution style ('under', 'over'):
    this.$resolve = this.resolveUnder;
    // bonuses/penalties ('diceNumber', 'rollValue', 'none'):
    this.$applyBonuses = this.onNumberOfDice;
  }

  check(details) {
    console.log(`---> check(${JSON.stringify(details)})`);
    let numberInGroup = this.$applyBonuses(details.numberInGroup);
    console.log("numberInGroup after bonuses/penalties: " + numberInGroup);
    let rolls = this.$check(numberInGroup);
    console.log("rolls:", rolls);
    let res = rolls.map(roll => this.$resolve(details.target, roll));
    console.log("res:", res);
  }

  /////////////////////////
  //   Resolution Type   //
  /////////////////////////
  single() {
    return [ this.$roll() ];
  }

  group(numberInGroup) {
    console.log(`---> group(${numberInGroup})`);
    let l1 = Array(numberInGroup).fill(0);
    return l1.map(_ => this.$roll() );
  }

  ///////////////////
  //   Dice Type   //
  ///////////////////
  sequence(target) {
    console.log(`---> sequence(${target})`);
  }

  specificDie() {
    console.log(`---> specificDie()`);
    return this.dieRoll(this.dice);
  }

  //////////////////////////
  //   Resolution Style   //
  //////////////////////////
  resolveUnder(target, result) {
    console.log(`---> resolveUnder(${target}, ${result})`)
    return target >= result;
  }

  resolveOver(target, result) {
    console.log(`---> resolveOver(${target}, ${result})`)
    return target <= result;
  }

  /////////////////////////////
  //   Bonuses & Penalties   //
  /////////////////////////////
  onNumberOfDice(numberInGroup) {

    return numberInGroup;
  }

  ////////////////
  //   Common   //
  ////////////////
  dieRoll(max) {
    return Math.floor(1 + Math.random() * max);
  }
}
