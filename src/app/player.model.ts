export class Player {
  public yDimension: number = 10;
  public xDimension: number = 10;
  public direction: string = "south";
  public xAttack = 0;
  public yAttack = 0;
  //EXPERIENCE & LEVEL
  public experience = 0;
  public level = 1;
  public skillPoints = 0;
  //STATS
  public strengthLvl = 10;
  public attackLvl = 40;
  public defenseLvl = 1;
  public health = 50;
  public damageModifier = (this.strengthLvl * 2);
  //GEAR
  public mainHand: Item = new Item("Bear Knuckles", "mainHand");
  public offHand: Item;
  public headSlot: Item = new Item("Cap", "headSlot");
  public chestSlot: Item = new Item("Tabard", "chestSlot");
  public legSlot: Item = new Item("Torn skirt", "legSlot");

  public inventory: Item[] = [this.mainHand, this.headSlot, this.chestSlot, this.legSlot, {name: "Health Potion", type: "Item"}];
  public healthPotions = 0;

  godMode(strength: number, attack: number, defense: number, health: number) {
    this.strengthLvl = strength;
    this.defenseLvl = defense;
    this.attackLvl = attack;
    this.health = health;
  }

  getXAttack() {
    if(this.direction === "west") {
      this.xAttack = -1 * this.xDimension;
    } else if(this.direction === "east") {
      this.xAttack = 1 * this.xDimension;
    } else {
      this.xAttack = 0;
    }
  }

  getYAttack() {
    if(this.direction === "south") {
      this.yAttack =  1 * this.yDimension;
    } else if(this.direction === "north") {
      this.yAttack =  -1 * this.yDimension;
    } else {
      this.yAttack = 0;
    }
  }
}

export class Item {

  constructor(public name: string, public type: string) { }
}
