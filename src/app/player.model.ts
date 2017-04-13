export class Player {
  public yDimension: number = 10;
  public xDimension: number = 10;
  public direction: string = "south";
  public xAttack = 0;
  public yAttack = 0;
  // WEAPON DIMENSIONS
  public weaponXSize: number = 5;
  public weaponYSize: number = 5;
  //EXPERIENCE & LEVEL
  public experience = 0;
  public level = 1;
  public skillPoints = 0;
  //STATS
  public strengthLvl = 10;
  public attackLvl = 40;
  public defenseLvl = 1;
  public health = 150;
  public damageModifier = (this.strengthLvl * 2);
  //GEAR
  public mainHand: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"]);
  public offHand: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"]);
  public headSlot: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"]);
  public chestSlot: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"]);
  public legSlot: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"]);

  public inventory: UserItem[] = [new UserItem("Bear Knuckles", "duoSet", [5], ["attack"]), new UserItem("Cap", "headSlot", [1], ["defense"]), new UserItem("Tabard", "chestSlot", [1], ["defense"]), new UserItem("Torn skirt", "legSlot", [1], ["defense"]), new UserItem("Health Potion", "UserItem", [30], ["health"])];
  //CONSUMABLES
  public healthPotions = 5;
  public strengthPotions = 0;
  public attackPotions = 0;
  public defensePotions = 0;

  godMode(strength: number, attack: number, defense: number, health: number) {
    this.strengthLvl = strength;
    this.defenseLvl = defense;
    this.attackLvl = attack;
    this.health = health;
    this.inventory.push(new UserItem("God Sword", "twoHander", [5000], ["strength"]), new UserItem("Off Hand Scimitar", "offHand", [500, 300], ["attack", "strength"]), new UserItem("Main Hand Scimitar", "mainHand", [500, 300], ["attack", "strength"]));
  }

  getXAttack() {
    if(this.direction === "west") {
      this.xAttack = -1 * this.weaponXSize;
    } else if(this.direction === "east") {
      this.xAttack = 1 * this.weaponXSize;
    } else {
      this.xAttack = 0;
    }
  }

  getYAttack() {
    if(this.direction === "south") {
      this.yAttack =  1 * this.weaponYSize;
    } else if(this.direction === "north") {
      this.yAttack =  -1 * this.weaponYSize;
    } else {
      this.yAttack = 0;
    }
  }
}

export class UserItem {


  constructor(public name: string, public type: string, public bonus: number[], public stat: string[]){  }
}
