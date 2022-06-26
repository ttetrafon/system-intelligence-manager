export class DiceRoller {
  // A dice roller is created for each resolution mechanic required by the game system (checks-subsection.js).
  // TODO: Dice rollers are initialised on renderer.js, and then used by the components wherever needed.

  constructor() {
    this.dice = 20;

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
    this.$resolve = this.resolveOver;
    // bonuses/penalties ('diceNumber', 'rollValue', 'none'):
    this.$applyBonuses = this.onNumberOfDice;
  }

  check(details) {
    console.log(`---> check(${JSON.stringify(details)})`);
    let numberInGroup = this.$applyBonuses(details.numberInGroup, details.bonus, details.penalty);
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
  onNumberOfDice(numberInGroup, bonus, penalty) {
    let num = numberInGroup + bonus - penalty;
    return num > 0 ? num : 1;
  }

  ////////////////
  //   Common   //
  ////////////////
  dieRoll(max) {
    return Math.floor(1 + Math.random() * max);
  }
}
