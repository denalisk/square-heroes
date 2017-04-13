import { DemoItem } from './item.model';
import { GameObject } from './game-object.model';

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
  public defenseLvl = 10;
  public attackLvl = 10;

  public strength = 0;
  public strengthBase = 10;
  public defense = 0;
  public defenseBase = 10;
  public attackBase = 10;
  public attack = 0;
  public health = 300;
  public damageModifier = 10 + (this.strengthLvl * 2);
  //GEAR
  public mainHand: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"], "#d575ef");
  public offHand: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"], "#d575ef");
  public headSlot: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"], "#d575ef");
  public chestSlot: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"], "#d575ef");
  public legSlot: UserItem = new UserItem("Nothing", "Nothing", [0], ["Nothing"], "#d575ef");

  public inventory: UserItem[] = [new UserItem("Bear Knuckles", "duoSet", [5], ["attack"], "#d575ef"), new UserItem("Cap", "headSlot", [1], ["defense"], "#d575ef"), new UserItem("Tabard", "chestSlot", [1], ["defense"], "#d575ef"), new UserItem("Torn Kilt", "legSlot", [1], ["defense"], "#d575ef"), new UserItem("Health Potion", "consumbale", [30], ["health"], "#d575ef")];
  public slotsList: string[] = ['mainHand', 'offHand', 'headSlot', 'legSlot', 'chestSlot'];
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
    this.inventory.push(new UserItem("God Sword", "twoHander", [5000], ["strength"], "#d575ef"), new UserItem("Off Hand Scimitar", "offHand", [500, 300], ["attack", "strength"], "#d575ef"), new UserItem("Main Hand Scimitar", "mainHand", [500, 300], ["attack", "strength"], "#d575ef"));
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

  equipGear(item: DemoItem) {
    if (this[item.modifier.trait] < item.modifier.trait) {
      alert(item.alert);
    } else {
      for (let position of item.equipPosition) {
        this[position] = item.name;
      }
      this.calculateStats();
    }
  }

  calculateStats(){
    this.defense = this.defenseBase;
    this.attack = this.attackBase;
    this.strength = this.strengthBase;
    for (let slot of this.slotsList) {
      for (let trait of this[slot].modifier) {
        this[trait[0]] += trait[1];
      }
    }
  }

  useItem(item: DemoItem) {
    if (item.type === 'consumable') {
      if (item.modifier[0][0] === 'health') {
        this.health += item.modifier[0][1];
      } else {
        let trait = item.modifier[0][0] + 'Base';
        this[trait] += item.modifier[0][1];
      }
    }
  }
}

export class UserItem {

  constructor(public name: string, public type: string, public bonus: number[], public stat: string[], public color: string){  }
}
