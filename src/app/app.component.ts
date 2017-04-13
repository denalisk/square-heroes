import { Component, OnInit } from '@angular/core';

import { Http, Headers } from '@angular/http';

import { GameObject, Enemy, Item, Village, Building } from './game-object.model';
import { Player } from './player.model';
import { UserItem } from './player.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  invisibleX: number = 0;
  invisibleY: number = 0;
  keyState = {};
  title = 'Square Heroes';
  objectsArray = [];
  animationsArray = [];
  canvas = null;
  ctx = null;
  player = null;
  velocityVector: number[] = [0,0];
  playerXCoord = null;
  playerYCoord = null;
  //VARIABLES FOR DICE ROLLS, DAMAGE DONE
  dmgRoll = 0;
  atkRoll = 0;
  damageDone = 0;
  currentEnemy = null;
  hitBool: boolean;
  southSwingCounter: number = 0;
  graveyard;
  theNorth;
  desert;

  // notification message
  message: string = "";
  alertTimer: boolean = false;



  //////////CONSTRUCTOR/////////////////
  constructor(private http: Http) {}

  // API CALLS ////////////////////////////////////////
  searchquery = '';
  tweetsdata;

  makecall() {
    let headers = new Headers();

    // Below looks like something is wrong
    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    // Below looks to be the main post call. Do we need a /authorize route?
    this.http.post('http://localhost:3000/authorize', {headers: headers}).subscribe()
  }

  searchcall(){
    var headers = new Headers();
    var searchterm = 'query=squareheroes';

    headers.append('Content-Type', 'application/X-www-form-urlencoded');
    // headers.append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');

    this.http.post('http://localhost:3000/search', searchterm, {headers: headers}).subscribe((res) => {
      this.tweetsdata = res.json().data.statuses;
    });
  }

  // COLLISION DETECTION ////////////////////////////////////////
  checkCollisions() {
    let current = this;
    let holdVector: number[] = [current.velocityVector[0], current.velocityVector[1]];
    for (let index = 0; index < current.objectsArray.length; index++) {
      if (current.objectsArray[index].collidable) {
        let checkItem = new GameObject('object');
        checkItem.setProperties(current.objectsArray[index].xCoord, current.objectsArray[index].yCoord, current.objectsArray[index].xDimension, current.objectsArray[index].yDimension, current.objectsArray[index].color);
        checkItem.move([holdVector[0], 0]);
        if (current.checkCollide(checkItem)) {
          current.velocityVector[0] = 0;
        }
        checkItem.move([-holdVector[0], holdVector[1]]);
        if (current.checkCollide(checkItem)) {
          current.velocityVector[1] = 0;
        }
      } else if (current.objectsArray[index].type === "item") {
        if (current.checkCollide(current.objectsArray[index])) {
          //CHECK IF ITEM IS A POTION, IF SO, ADD IT TO THE POTION LIST
          if(current.objectsArray[index].userItem.name === "Health Potion") {
            current.player.healthPotions += 1;
          } else if(current.objectsArray[index].userItem.name === "Strength Potion") {
            current.player.strengthPotions += 1;
          } else if(current.objectsArray[index].userItem.name === "Attack Potion") {
            current.player.attackPotions += 1;
          } else if(current.objectsArray[index].userItem.name === "Defense Potion") {
            current.player.defensePotions += 1;
          } else {
            var haveItem = false;
            for(var i = 0; i < current.player.inventory.length; i++)
            {
              if(current.player.inventory[i].name === current.objectsArray[index].userItem.name) {
                haveItem = true;
              }
            }
            if(haveItem === false) {
              current.player.inventory.splice(0, 0, current.objectsArray[index].userItem);
              current.message = "You picked up a " + current.objectsArray[index].userItem.name;
              current.alertTimer = true;
              setTimeout(function(){
                current.alertTimer = false;
              }, 1000)
            }
          }

          current.objectsArray.splice(index);
        }
      }
    }
  }


  checkCollide(item: GameObject) {
    var current = this;
    if (item.xCoord < current.playerXCoord + current.player.xDimension &&
        item.xCoord + item.xDimension > current.playerXCoord &&
        item.yCoord < current.playerYCoord + current.player.yDimension &&
        item.yDimension + item.yCoord > current.playerYCoord) {
          return true;
    } else {
          return false;
    }
  }

  //ADD SKILL POINTS INTO SKILL FUNCTION
  addSkill(stat: string) {
    if(this.player.skillPoints > 0)
    {
      if(stat === "attack")
      {
        this.player.attackLvl += 1;
        this.player.skillPoints -= 1;
      }else if(stat === "strength")
      {
        this.player.strengthLvl += 1;
        this.player.skillPoints -= 1;
        this.player.damageModifier = 10 + (this.player.strengthLvl * 2);
      }else if(stat === "defense")
      {
        this.player.defenseLvl += 1;
        this.player.health += 30;
        this.player.skillPoints -= 1;
      }
    }
  }

  //EQUIP STATS REFACTOR
  equipGear(item: UserItem) {
    for(var i = 0; i < item.stat.length; i++)
    {
      if(item.stat[i] === "attack")
      {
        this.player.attackLvl += item.bonus[i];
      } else if(item.stat[i] === "strength")
      {
        this.player.strengthLvl += item.bonus[i];
        this.player.damageModifier = 10 + (this.player.strengthLvl * 2);
      } else if(item.stat[i] === "defense")
      {
        this.player.health += (item.bonus[i] * 3);
        this.player.defenseLvl += item.bonus[i];
      }
    }
  }

  //UNEQUIP STATS REFACTOR
  unequipGear(item: UserItem) {
    for(var i = 0; i < item.stat.length; i++)
    {
      if(item.stat[i] === "attack")
      {
        this.player.attackLvl -= item.bonus[i];
      } else if(item.stat[i] === "strength")
      {
        this.player.strengthLvl -= item.bonus[i];
        this.player.damageModifier = 10 + (this.player.strengthLvl * 2);
      } else if(item.stat[i] === "defense")
      {
        this.player.health -= (item.bonus[i] * 3);
        this.player.defenseLvl -= item.bonus[i];
      }
    }
  }

  //EQUIPING AND USING ITEMS
  useItem(item: UserItem) {
    if(item.type === "consumable") {


    } else if(item.type === "headSlot") {
      //UNEQUIP GEAR, SET STATS CORRECTLY, THEN EQUIP NEW GEAR
      if(item.name === "Iron Helm") {
        if(this.player.defenseLvl >= 10) {
          this.unequipGear(this.player.headSlot);
          this.equipGear(item);
          this.player.headSlot = item;
        } else {
          alert("Defense level needs to be atleast 10 to wear this, noob");
        }
      } else if(item.name === "Mithril Helm") {
        if(this.player.defenseLvl >= 20) {
          this.unequipGear(this.player.headSlot);
          this.equipGear(item);
          this.player.headSlot = item;
        } else {
          alert("Defense level needs to be atleast 20 to wear this, scrub");
        }
      } else if(item.name === "Robinhood Hat") {
        if(this.player.defenseLvl >= 60) {
          this.unequipGear(this.player.headSlot);
          this.equipGear(item);
          this.player.headSlot = item;
        } else {
          alert("Defense level needs to be atleast 60 to wear this, pleeb");
        }
      } else {
        this.unequipGear(this.player.headSlot);
        this.equipGear(item);
        this.player.headSlot = item;
      }
    } else if(item.type === "chestSlot") {
      //UNEQUIP GEAR, SET STATS CORRECTLY, THEN EQUIP NEW GEAR
      if(item.name === "Iron Chestplate") {
        if(this.player.defenseLvl >= 10) {
          this.unequipGear(this.player.chestSlot);
          this.equipGear(item);
          this.player.chestSlot = item;
        } else {
          alert("Defense level needs to be atleast 10 to wear this, noob");
        }
      } else if(item.name === "Mithril Chestplate") {
        if(this.player.defenseLvl >= 20) {
          this.unequipGear(this.player.chestSlot);
          this.equipGear(item);
          this.player.chestSlot = item;
        } else {
          alert("Defense level needs to be atleast 20 to wear this, scrub");
        }
      } else if(item.name === "Gladiator Chestplate") {
        if(this.player.defenseLvl >= 100) {
          this.unequipGear(this.player.chestSlot);
          this.equipGear(item);
          this.player.chestSlot = item;
        } else {
          alert("Defense level needs to be atleast 100 to wear this, pleeb");
        }
      } else {
        this.unequipGear(this.player.chestSlot);
        this.equipGear(item);
        this.player.chestSlot = item;
      }
    } else if(item.type === "legSlot") {
      //UNEQUIP GEAR, SET STATS CORRECTLY, THEN EQUIP NEW GEAR
      if(item.name === "Iron Greeves") {
        if(this.player.defenseLvl >= 10) {
          this.unequipGear(this.player.legSlot);
          this.equipGear(item);
          this.player.legSlot = item;
        } else {
          alert("Defense level needs to be atleast 10 to wear this, noob");
        }
      } else if(item.name === "Mithril Greeves") {
        if(this.player.defenseLvl >= 20) {
          this.unequipGear(this.player.legSlot);
          this.equipGear(item);
          this.player.legSlot = item;
        } else {
          alert("Defense level needs to be atleast 20 to wear this, scrub");
        }
      } else if(item.name === "Chad Legs(ULTIMA)") {
        if(this.player.defenseLvl >= 100) {
          this.unequipGear(this.player.legSlot);
          this.equipGear(item);
          this.player.legSlot = item;
        } else {
          alert("Defense level needs to be atleast 100 to wear these bad boys, pleeb");
        }
      } else {
        this.unequipGear(this.player.legSlot);
        this.equipGear(item);
        this.player.legSlot = item;
      }
    } else if(item.type === "mainHand") {
      if(this.player.offHand.type === "duoSet") {
        this.unequipGear(this.player.offHand);
        this.player.offHand = new UserItem("Nothing", "offHand", [0], ["Nothing"], "#d575ef");
      }
      if(item.name === "MH Scimitar") {
        if(this.player.attackLvl >= 20) {
          this.unequipGear(this.player.mainHand);
          this.equipGear(item);
          this.player.mainHand = item;
        } else {
          alert("You need atleast 20 attack to equip this weapon, scrub");
        }
      } else if(item.name === "MH Kiteen Bomb") {
        if(this.player.attackLvl >= 60) {
          this.unequipGear(this.player.mainHand);
          this.equipGear(item);
          this.player.mainHand = item;
        } else {
          alert("You need atleast 60 attack throw the kitties");
        }
      } else if(item.name === "Blue Light Saber") {
        if(this.player.attackLvl >= 100) {
          this.unequipGear(this.player.mainHand);
          this.equipGear(item);
          this.player.mainHand = item;
        } else {
          alert("You aren't strong enough with the force yet, 100 attack level to wield this weapon, you must have, Skywalker");
        }
      } else {
        this.unequipGear(this.player.mainHand);
        this.equipGear(item);
        this.player.mainHand = item;
      }
    } else if(item.type === "offHand") {
      if(this.player.mainHand.type === "duoSet") {
        this.unequipGear(this.player.mainHand);
        this.player.mainHand = new UserItem("Nothing", "offHand", [0], ["Nothing"], "#d575ef");
      }
      else if(this.player.mainHand.type === "twoHander") {
        this.unequipGear(this.player.mainHand);
        this.player.mainHand = new UserItem("Nothing", "mainHand", [0], ["Nothing"], "#d575ef");
      }
      if(item.name === "OH Scimitar") {
        if(this.player.attackLvl >= 20) {
          this.unequipGear(this.player.mainHand);
          this.equipGear(item);
          this.player.mainHand = item;
        } else {
          alert("You need atleast 20 attack to equip this weapon, scrub");
        }
      } else if(item.name === "OH Kiteen Bomb") {
        if(this.player.attackLvl >= 60) {
          this.unequipGear(this.player.mainHand);
          this.equipGear(item);
          this.player.mainHand = item;
        } else {
          alert("You need atleast 60 attack throw the kitties");
        }
      } else if(item.name === "Green Light Saber") {
        if(this.player.attackLvl >= 100) {
          this.unequipGear(this.player.mainHand);
          this.equipGear(item);
          this.player.mainHand = item;
        } else {
          alert("You aren't strong enough with the force yet, 100 attack level to wield this weapon, you must have, Skywalker");
        }
      }
      this.unequipGear(this.player.offHand);
      this.equipGear(item);
      this.player.offHand = item;
    } else if(item.type === "twoHander") {
      if(item.name === "Claymore") {
        if(this.player.attackLvl >= 20 && this.player.strengthLvl >= 20) {
          this.unequipGear(this.player.mainHand);
          this.unequipGear(this.player.offHand);
          this.equipGear(item);
          this.player.mainHand = item;
          this.player.offHand = new UserItem("Nothing", "offHand", [0], ["Nothing"], "#d575ef");
        } else {
          alert("You attack and strength expertise must be 20 or greater to wield these, braveheart");
        }
      } else if(item.name === "Katana") {
          if(this.player.attackLvl >= 60) {
            this.unequipGear(this.player.mainHand);
            this.unequipGear(this.player.offHand);
            this.equipGear(item);
            this.player.mainHand = item;
            this.player.offHand = new UserItem("Nothing", "offHand", [0], ["Nothing"], "#d575ef");
          } else {
            alert("You think you can wield the Katana, young one, try again when your attack level is 60");
          }
        } else if(item.name === "Illidan's Warglaive") {
          if(this.player.attackLvl >= 100) {
            this.unequipGear(this.player.mainHand);
            this.unequipGear(this.player.offHand);
            this.equipGear(item);
            this.player.mainHand = item;
            this.player.offHand = new UserItem("Nothing", "offHand", [0], ["Nothing"], "#d575ef");
          } else {
            alert("Come back when your attack level is atleast 100 you stupid demon hunter");
          }
        } else {
          this.unequipGear(this.player.mainHand);
          this.unequipGear(this.player.offHand);
          this.equipGear(item);
          this.player.mainHand = item;
          this.player.offHand = new UserItem("Nothing", "offHand", [0], ["Nothing"], "#d575ef");
        }
    } else if(item.type === "duoSet") {
      if(item.name === "Nunchucks") {
        if(this.player.attackLvl >= 35) {
          this.unequipGear(this.player.mainHand);
          this.unequipGear(this.player.offHand);
          this.player.mainHand = item;
          this.player.offHand = item;
          this.equipGear(this.player.mainHand);
          this.equipGear(this.player.offHand);
        } else {
          alert("You attack expertise must be 35 or greater to wield these, kneenja");
        }
      } else {
        this.unequipGear(this.player.mainHand);
        this.unequipGear(this.player.offHand);
        this.player.mainHand = item;
        this.player.offHand = item;
        this.equipGear(this.player.mainHand);
        this.equipGear(this.player.offHand);
      }
    }
  }

  //USE POTIONS
  useHealthPot() {
    if(this.player.healthPotions > 0)
    {
      this.player.health += 75;
      this.player.healthPotions -= 1;
    }
  }
  useStrengthPot() {
    if(this.player.strengthPotions > 0)
    {
      this.player.strengthLvl += 5;
      this.player.strengthPotions -= 1;
    }
  }
  useAttackPot() {
    if(this.player.attackPotions > 0)
    {
      this.player.attackLvl += 5;
      this.player.attackPotions -= 1;
    }
  }
  useDefensePot() {
    if(this.player.defensePotions > 0)
    {
      this.player.defenseLvl += 5;
      this.player.defensePotions -= 1;
    }
  }

  //////INITIALIZATION///////
  ngOnInit() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    //API Initialization with Tweets
    this.makecall();

    window.addEventListener('keydown',(e) => {
        this.keyState[e.keyCode || e.which] = true;
    },true);
    window.addEventListener('keyup', (e) => {
        this.keyState[e.keyCode || e.which] = false;
    },true);

    this.player = new Player();
    // this.player.godMode(1000, 1000, 10, 10000);
    this.playerXCoord = ((this.canvas.width / 2) - 5);
    this.playerYCoord = ((this.canvas.height / 2) - 5);
    this.invisibleX = this.playerXCoord;
    this.invisibleY = this.playerYCoord;
    this.generateWorld();
  }

  /////////WORLD GENERATION/////////
  generateWorld() {
    //Graveyard
    this.graveyard = new Village("village");
    this.graveyard.setProperties(-800, 170, 500, 500, "gray")
    this.objectsArray.push(this.graveyard);

    for(let i = 0; i < this.graveyard.buildings; i++) {
      var newBuilding = new Building("building", this.graveyard);
      this.objectsArray.push(newBuilding);
    }

    this.generateBoss()

    //The North
    this.theNorth = new Village("village");
    this.theNorth.setProperties(-1000, -2000, 2000, 1000, "#e8e8e8");
    this.theNorth.buildings = 70;
    this.objectsArray.push(this.theNorth);

    for(let i = 0; i < this.theNorth.buildings; i++) {
      var newBuilding = new Building("building", this.theNorth);
      this.objectsArray.push(newBuilding);
    }

    for(let i = 0; i < 90; i++) {
      var newEnemy = new Enemy('enemy');
      var dimensions: number = Math.floor(Math.random() * (Math.floor(50) - Math.ceil(40)) + Math.ceil(50));
      newEnemy.setProperties(
      Math.floor(Math.random() * (Math.floor(this.theNorth.xCoord + this.theNorth.xDimension) - Math.ceil(this.theNorth.xCoord)) + Math.ceil(this.theNorth.xCoord)),
      Math.floor(Math.random() * (Math.floor(this.theNorth.yCoord + this.theNorth.yDimension) - Math.ceil(this.theNorth.yCoord)) + Math.ceil(this.theNorth.yCoord)), dimensions,
      dimensions, "#0d9664");
      this.objectsArray.push(newEnemy);
    }

    this.generateNorthBoss();

    //Desert (South)

    this.desert = new Village("village");
    this.desert.setProperties(-1000, 1000, 2000, 1000, "#779148");
    this.desert.buildings = 70;
    this.objectsArray.push(this.desert);

    for(let i = 0; i < this.desert.buildings; i++) {
      var newBuilding = new Building("building", this.desert);
      this.objectsArray.push(newBuilding);
    }

    for(let i = 0; i < 90; i++) {
      var newEnemy = new Enemy('enemy');
      var dimensions: number = Math.floor(Math.random() * (Math.floor(30) - Math.ceil(20)) + Math.ceil(30));
      newEnemy.setProperties(
      Math.floor(Math.random() * (Math.floor(this.desert.xCoord + this.desert.xDimension) - Math.ceil(this.desert.xCoord)) + Math.ceil(this.desert.xCoord)),
      Math.floor(Math.random() * (Math.floor(this.desert.yCoord + this.desert.yDimension) - Math.ceil(this.desert.yCoord)) + Math.ceil(this.desert.yCoord)), dimensions,
      dimensions, "#994227");
      this.objectsArray.push(newEnemy);
    }

    //Trees
    var numberOfTrees = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(60)) + Math.ceil(100));
    for(var i = 0; i < numberOfTrees; i++) {
      this.objectsArray.push(new GameObject("tree"));
    }
    //Mountains
    var numberofMountains = Math.floor(Math.random() * (Math.floor(60) - Math.ceil(40)) + Math.ceil(60));
    for(var i = 0; i < numberofMountains; i++) {
      this.generateMountain();
    }
    //Enemies
    var numberOfEnemies = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(50)) + Math.ceil(100))

    for(var i = 0; i < numberOfEnemies; i++) {
      this.objectsArray.push(new Enemy("enemy"));
    }

    this.gameLoop();
  }

  generateBoss() {
    //Add BOSS to village
    var bossEnemy = new Enemy('enemy');
    bossEnemy.setProperties((this.graveyard.xCoord + (this.graveyard.xDimension/2)), (this.graveyard.yCoord + (this.graveyard.yDimension/2)), 50, 50, "#6b245f");
    this.objectsArray.push(bossEnemy);
    //BOSS Minions
    for(let i = 10; i < 100; i += 10) {
      var bossMinion = new Enemy('enemy');
      bossMinion.setProperties((this.graveyard.xCoord + (this.graveyard.xDimension/2) + i), (this.graveyard.yCoord + (this.graveyard.yDimension/2) + i), 10, 10, "#774f9b");
      this.objectsArray.push(bossMinion);
    }
  }

  generateNorthBoss() {
    //Add BOSS to village
    var bossEnemy = new Enemy('enemy');
    bossEnemy.setProperties((this.theNorth.xCoord + (this.theNorth.xDimension/2)), (this.theNorth.yCoord + (this.theNorth.yDimension/2)), 100, 100, "#59182e");
    console.log("Boss spawned at: " + bossEnemy.xCoord + ", " + bossEnemy.yCoord);
    this.objectsArray.push(bossEnemy);
    //BOSS Minions
    for(let i = 20; i < 200; i += 20) {
      var bossMinion = new Enemy('enemy');
      bossMinion.setProperties((this.theNorth.xCoord + (this.theNorth.xDimension/2) + i), (this.theNorth.yCoord + (this.theNorth.yDimension/2) + i), 20, 20, "#0e4430");
      console.log("Boss enemy spawned at:" + bossMinion.xCoord + ", " + bossMinion.yCoord);
      this.objectsArray.push(bossMinion);
    }
  }


  generateTree() {
    let newTree = new GameObject('tree');
    this.objectsArray.push(newTree);
  }

  generateMountain() {
    // This functions will create a mountain object and push it to the objectsArray
    let newMountain = new GameObject('mountain');
    newMountain.setProperties(newMountain.xCoord, newMountain.yCoord, 80, 24, 'brown');
    newMountain.shape = 'triangle';
    this.objectsArray.push(newMountain);
  }

  //////////ITEM WHEN ENIME DIES////////////
  generateItem(xCoord, yCoord, thing) {
    var roll;
    var highArray: UserItem[] = [new UserItem("Health Potion", "consumable", [30], ["health"], "#ff3f3f"), new UserItem("Strength Potion", "consumable", [30], ["strength"], "#ff3f3f"), new UserItem("Attack Potion", "consumable", [30], ["attack"], "#ff3f3f"), new UserItem("Defense Potion", "consumable", [30], ["defense"], "#ff3f3f")];
    var lowGear: UserItem[] = [new UserItem("Iron Helm", "headSlot", [20], ["defense"], "#cecece"), new UserItem("Iron Chestplate", "chestSlot", [20], ["defense"], "#cecece"), new UserItem("Iron Greeves", "legSlot", [20], ["defense"], "#cecece"), new UserItem("Sword", "mainHand", [20, 20], ["strength", "attack"], "#cecece"), new UserItem("Shield", "offHand", [30], ["defense"], "#cecece"), new UserItem("Claymore", "twoHander", [40], ["strength"], "#cecece")];
    var medGear: UserItem[] = [new UserItem("Mithril Helm", "headSlot", [40], ["defense"], "#7ca0f9"), new UserItem("Mithril Chestplate", "chestSlot", [40], ["defense"], "#7ca0f9"), new UserItem("Mithril Greeves", "legSlot", [40], ["defense"], "#7ca0f9"), new UserItem("Katana", "twoHander", [10, 120], ["attack", "strength"], "#7ca0f9"), new UserItem("Nunchucks", "duoSet", [50, 50], ["attack", "strength"], "#7ca0f9"), new UserItem("MH Scimitar", "mainHand", [65], ["strength"], "#7ca0f9"), new UserItem("OH Scimitar", "offHand", [60], ["attack"], "#7ca0f9")];
    var rareGear: UserItem[] = [new UserItem("Robinhood Hat", "headSlot", [150], ["attack"], "#d575ef"), new UserItem("Gladiator Chestplate", "chestSlot", [150], ["strength"], "#d575ef"), new UserItem("MH Kitten Bomb", "mainHand", [80, 120], ["attack", "strength"], "#d575ef"), new UserItem("OH Kitten Bomb", "offHand", [120, 80], ["attack", "strength"], "#d575ef")];
    var epicGear: UserItem[] = [new UserItem("Chad's Legs(ULTIMA)", "legSlot", [300], ["attack"], "#ed8055"),  new UserItem("Blue Light Saber", "mainHand", [200, 200], ["attack", "strength"], "#ed8055"), new UserItem("Green Light Saber", "offHand", [200, 200], ["attack", "strength"], "#ed8055"), new UserItem("Illidan's Warglaive", "twoHander", [100, 400], ["attack", "strength"], "#ed8055"), new UserItem("Armour Forged From Sam's Crocks", "chestSlot", [450], ["defense", "strength"], "#4d843e"), new UserItem("Minhish Cap(ULTIMA)", "headSlot", [300], ["attack"], "#ed8055"), new UserItem("Derek's Spinner", "mainHand", [300], ["strength"], "#ed8055"), new UserItem("Shield of Law-rence", "offHand", [300], ["defense"], "#ed8055")];

    var graveGear: UserItem[] = [new UserItem("Tombstone", "twoHander", [150, -30], ["strength", "attack"], "#d575ef"), new UserItem("Pumpkin Head", "headSlot", [60, -10], ["defense", "attack"], "#d575ef"), new UserItem("Rickity Rib Cage", "chestSlot", [55], ["defense"], "#d575ef"), new UserItem("MH Bone Dagger", "mainHand", [65], ["strength"], "#d575ef"), new UserItem("OH Bone Dagger", "mainHand", [65], ["attack"], "#d575ef")];
    var northGear: UserItem[] = [new UserItem("Ushanka-hat", "headSlot", [120, 50], ["defense", "attack"], "white"), new UserItem("Grizzley Fur Coat", "chestSlot", [150, 30], ["strength", "defense"], "white"), new UserItem("Ice Picks", "duoSet", [60, 60], ["attack", "strength"], "white"), new UserItem("Longclaw", "mainHand", [120], ["strength"], "white")];
    var swampGear: UserItem[] = [new UserItem("Tribal Shield", "offHand" , [100], ["defense"], "#4d843e"), new UserItem("Double Hatchets", "duoSet", [75, -10], ["strength", "attack"], "#4d843e"), new UserItem("Voodoo Machete", "mainHand", [100], ["strength"], "#4d843e"), new UserItem("Hex Greeves", "legSlot", [70], ["defense"], "#4d843e"), new UserItem("Shrunken Head", "headSlot", [80], ["defense"], "#4d843e")];

    var newItem = new Item("item");

    newItem.xCoord = xCoord;
    newItem.yCoord = yCoord;
    newItem.yDimension = 5;
    newItem.xDimension = 5;

    if(thing === "swampBoss") {
      //DROP TRABLE CHANCE
      var selectDropTable = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
      if(selectDropTable >= 0 && 50 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(medGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = medGear[roll];
      } else if(selectDropTable >= 50 && 85 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(swampGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = swampGear[roll];
      } else if(selectDropTable >= 85 && 95 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(rareGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = rareGear[roll];
      } else if(selectDropTable >= 95 &&  100 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(epicGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = epicGear[roll];
      }
    } else if(thing === "northBoss") {
      //DROP TRABLE CHANCE
      var selectDropTable = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
      if(selectDropTable >= 0 && 50 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(medGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = medGear[roll];
      } else if(selectDropTable >= 50 && 85 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(northGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = northGear[roll];
      } else if(selectDropTable >= 85 && 95 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(rareGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = rareGear[roll];
      } else if(selectDropTable >= 95 &&  100 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(epicGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = epicGear[roll];
      }
    } else if(thing === "graveBoss") {
      //DROP TRABLE CHANCE
      var selectDropTable = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
      if(selectDropTable >= 0 && 50 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(medGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = medGear[roll];
      } else if(selectDropTable >= 50 && 85 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(graveGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = graveGear[roll];
      } else if(selectDropTable >= 85 && 95 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(rareGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = rareGear[roll];
      } else if(selectDropTable >= 95 &&  100 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(epicGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = epicGear[roll];
      }
    } else if(thing === "high") {
      roll = Math.floor(Math.random() * (Math.floor(highArray.length) - Math.ceil(0)) + Math.ceil(0));
      newItem.userItem = highArray[roll];
    } else {
      //DROP TABLE CHANCE
      var selectDropTable = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
      if(selectDropTable >= 0 && 60 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(lowGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = lowGear[roll];
      } else if(selectDropTable >= 60 && 90 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(medGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = medGear[roll];
      } else if(selectDropTable >= 90 && 93 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(rareGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = rareGear[roll];
      } else if(selectDropTable === 99) {
        roll = Math.floor(Math.random() * (Math.floor(epicGear.length) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = epicGear[roll];
      }
    }

    console.log("You Got a " + newItem.userItem.name + " drop")
    this.objectsArray.push(newItem);
  }


  //RESPAWN
  respawn(enemy) {
    var current = this;
    setTimeout(function() {
      var oldX = enemy.xCoord;
      var oldY = enemy.yCoord;
      var newEnemy = enemy;
      enemy.setProperties(enemy.xCoord + current.invisibleX, enemy.yCoord + current.invisibleY, enemy.xDimension, enemy.yDimension, enemy.color);
      current.objectsArray.push(enemy);
    }, 10000);
  }

  respawnNorth() {
    var current = this;
    setTimeout(function() {
      var newEnemy = new Enemy('enemy');
      var dimensions: number = Math.floor(Math.random() * (Math.floor(50) - Math.ceil(40)) + Math.ceil(50));
      newEnemy.setProperties(
      Math.floor(Math.random() * (Math.floor(current.theNorth.xCoord + current.theNorth.xDimension) - Math.ceil(current.theNorth.xCoord)) + Math.ceil(current.theNorth.xCoord)),
      Math.floor(Math.random() * (Math.floor(current.theNorth.yCoord + current.theNorth.yDimension) - Math.ceil(current.theNorth.yCoord)) + Math.ceil(current.theNorth.yCoord)),
      dimensions,
      dimensions, "#0d9664");
      current.objectsArray.push(newEnemy);
    }, 10000);
  }

  respawnSouth() {
    var current = this;
    setTimeout(function() {
      var newEnemy = new Enemy('enemy');
      var dimensions: number = Math.floor(Math.random() * (Math.floor(30) - Math.ceil(20)) + Math.ceil(30));
      newEnemy.setProperties(
      Math.floor(Math.random() * (Math.floor(current.desert.xCoord + current.desert.xDimension) - Math.ceil(current.desert.xCoord)) + Math.ceil(current.desert.xCoord)),
      Math.floor(Math.random() * (Math.floor(current.desert.yCoord + current.desert.yDimension) - Math.ceil(current.desert.yCoord)) + Math.ceil(current.desert.yCoord)), dimensions,
      dimensions, "#994227");
      current.objectsArray.push(newEnemy);
    }, 10000);
  }

  //////////ATTACK//////////////
  attack() {
    this.player.getXAttack();
    this.player.getYAttack();
    for(var i = 0; i < this.objectsArray.length; i++) {
      //COLLISION DETETION
      if( this.objectsArray[i].xCoord < (this.playerXCoord) + this.player.xAttack + this.player.xDimension && this.objectsArray[i].xCoord + this.objectsArray[i].xDimension > (this.playerXCoord) + this.player.xAttack && this.objectsArray[i].yCoord < (this.canvas.height / 2 - 5) + this.player.yAttack + this.player.yDimension && this.objectsArray[i].yDimension + this.objectsArray[i].yCoord > (this.canvas.height / 2 - 5) + this.player.yAttack) {
        //COLLISION FOUND
          if(this.objectsArray[i].type === "enemy") {
            this.currentEnemy = this.objectsArray[i];
            //ENEMY IS BEING ATTACKED
            //ATTACK AND DAMAGE ROLLS FOR COMBAT
            //ATTACK ROLL
            this.atkRoll = Math.floor(Math.random() * (Math.floor(200) - Math.ceil(1)) + Math.ceil(1));

            if(this.atkRoll > (60 - (this.player.attackLvl / 2)))
            {
              this.hitBool = true;
              //DAMAGE ROLL
              var maxHit = 10 + (this.player.strengthLvl * 2);
              this.dmgRoll = Math.floor(Math.random() * (Math.floor(maxHit) - Math.ceil(0)) + Math.ceil(0));
              if(this.dmgRoll != 0)
              {
                this.damageDone = this.dmgRoll; // + (this.player.strengthLvl / 2);
                this.objectsArray[i].health -= this.damageDone;
              }
            } else {
              this.hitBool = false;
            }
            //DEATH OF ENEMY
            if(this.objectsArray[i].health <= 0) {
              //ENEMY RESPAWN
              if(this.objectsArray[i].color === "#6b245f") {
                var current = this;
                setTimeout(function() {
                  current.generateBoss();
                }, 60000)
              } else if(this.objectsArray[i].color === "#59182e") {
                var current = this;
                setTimeout(function() {
                  current.generateNorthBoss();
                }, 60000)
              } else if (this.objectsArray[i].color === "#59182e"){
                this.respawnSouth()
              } else {
                this.respawn(this.objectsArray[i]);
              }
              var xCoord: number = this.objectsArray[i].xCoord;
              var yCoord: number = this.objectsArray[i].yCoord;
              //EXPERIENCE DROP
              var expDrop = Math.floor(Math.random() * (Math.floor(15) - Math.ceil(5)) + Math.ceil(5));
              this.player.experience += expDrop;
              //LEVEL UP
              //EVERY LEVEL, EXPERIENCE NEEDED TO LEVEL UP IS DOUBLED
              if(this.player.experience >= (this.player.level * 30))
              {
                //LEVEL GAIN
                this.player.level += 1;
                //SKILL POINT GAIN
                this.player.skillPoints += 5;
                //RESET EXPERIENCE
                this.player.experience = 0;
              }

              this.objectsArray.splice(i, 1);
              // DROPROLL CHANCE

              if(this.currentEnemy.xDimension === 100)
             {
               var dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
               if(dropRoll > 30) {
                 this.generateItem(xCoord, yCoord, 'northBoss');
               }
             } else if(this.currentEnemy.xDimension === 50 && this.currentEnemy.color === "#0e4430")
             {
               var dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
               if(dropRoll > 30) {
                 this.generateItem(xCoord, yCoord, 'northBoss');
               }
             } else if(this.currentEnemy.xDimension > 20 && this.currentEnemy.xDimension <= 30)
              {
                var dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
                if(dropRoll > 30) {
                  this.generateItem(xCoord, yCoord, 'swampBoss');
                }
              } else if(this.currentEnemy.xDimension === 50 && this.currentEnemy.color === "#6b245f")
              {
                var dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
                if(dropRoll > 30) {
                  this.generateItem(xCoord, yCoord, 'graveBoss');
                }
              } else {
                var dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
                if (dropRoll < 70) {
                  if (dropRoll < 20) {
                    this.generateItem(xCoord, yCoord, 'high');
                  } else {
                    this.generateItem(xCoord, yCoord, 'low');
                  }
                } else {
                  console.log("nope")
                }
              }
            }

          } else if (this.objectsArray[i].type === "tree"){
            //TREE IS BEING ATTACKED
            this.objectsArray.splice(i, 1);
          }
      }
    }
  }

  //ENEMY ATTACK
  enemyAttack(enemy) {
    if(!enemy.enemyAttacking) {
      enemy.enemyAttacking = true;
      //Calculate damage of enemy damage minus defense
      var enemyDamage = enemy.rollForDamage() - Math.trunc(this.player.defenseLvl  / 3);
      if(enemyDamage > 0) {
        this.player.health -= enemy.rollForDamage() - Math.trunc(this.player.defenseLvl  / 3);
      } else {
        this.player.health--;
      }
      setTimeout(function(){
        enemy.enemyAttacking = false;
      }, 500);
    }
  }

  //AGGRO
  enemyAggro(enemy) {
    var aggroRadius = 100;
      if(enemy.xCoord < (this.canvas.width / 2 - (aggroRadius / 2)) + this.player.xDimension + aggroRadius && enemy.xCoord + enemy.xDimension > (this.canvas.width / 2 - (aggroRadius / 2)) && enemy.yCoord < (this.canvas.height / 2) - (aggroRadius / 2) + this.player.yDimension + aggroRadius && enemy.yDimension + enemy.yCoord > (this.canvas.height / 2) - (aggroRadius / 2)) {
        //MOVE TOWARDS PLAYER
        var vector: number[] = [0, 0];
        if(this.playerXCoord < enemy.xCoord) {
          vector[0] = -.5;
        } else {
          vector[0] = .5;
        }

        if(this.playerYCoord < enemy.yCoord) {
          vector[1] = -.5;
        } else {
          vector[1] = .5;
        }
        if(enemy.xCoord < (this.canvas.width / 2 - 10) + this.player.xDimension + 10 && enemy.xCoord + enemy.xDimension > (this.canvas.width / 2 - 10) && enemy.yCoord < (this.canvas.height / 2 - 10) + this.player.yDimension + 10 && enemy.yDimension + enemy.yCoord > (this.canvas.height / 2 - 10)) {
          vector = [0, 0];
          //KITEABILITY
          var current = this;
          setTimeout(function(){
            if(enemy.xCoord < (current.canvas.width / 2 - 10) + current.player.xDimension + 10 && enemy.xCoord + enemy.xDimension > (current.canvas.width / 2 - 10) && enemy.yCoord < (current.canvas.height / 2 - 10) + current.player.yDimension + 10 && enemy.yDimension + enemy.yCoord > (current.canvas.height / 2 - 10)) {
              //ENEMY IS IN ATTACK RANGE
              current.enemyAttack(enemy);
            }
          }, 300);
        }
          enemy.move(vector);
        }
    }

  ///////////////////DRAWING FUNCTIONS/////////////////////////

  drawTree(gameObject: GameObject) {
    // This function draws trees given an object with coordinates
    this.ctx.beginPath();
    this.ctx.moveTo(gameObject.xCoord, gameObject.yCoord + (gameObject.yDimension / 2));
    this.ctx.lineTo(gameObject.xCoord + 10, gameObject.yCoord + (gameObject.yDimension / 2));
    this.ctx.lineTo(gameObject.xCoord + 5, gameObject.yCoord + (gameObject.yDimension / 2) - 5);
    this.ctx.lineTo(gameObject.xCoord, gameObject.yCoord + (gameObject.yDimension / 2));
    this.ctx.fillStyle = "green"
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(gameObject.xCoord, gameObject.yCoord + 2);
    this.ctx.lineTo(gameObject.xCoord + 10, gameObject.yCoord + 2);
    this.ctx.lineTo(gameObject.xCoord + 5, gameObject.yCoord + 2 - 5);
    this.ctx.lineTo(gameObject.xCoord, gameObject.yCoord + 2);
    this.ctx.fillStyle = "green"
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(gameObject.xCoord, gameObject.yCoord + 5);
    this.ctx.lineTo(gameObject.xCoord + 10, gameObject.yCoord + 5);
    this.ctx.lineTo(gameObject.xCoord + 5, gameObject.yCoord);
    this.ctx.lineTo(gameObject.xCoord, gameObject.yCoord + 5);
    this.ctx.fillStyle = "green"
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawMountain(gameObject: GameObject) {
    let x = gameObject.xCoord;
    let y = gameObject.yCoord;
    let yDim = gameObject.yDimension;
    let xDim = gameObject.xDimension;
    let xy = [x, y];
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + yDim);
    this.ctx.lineTo(x + xDim/2, y);
    this.ctx.lineTo(x + xDim, y + yDim);
    this.ctx.lineTo(x, y + yDim);
    this.ctx.fillStyle = 'brown';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawVillage(gameObject: Village) {
    this.ctx.beginPath();
    this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
    this.ctx.fillStyle = gameObject.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawBuilding(gameObject: Building) {
    this.ctx.beginPath();
    this.ctx.moveTo(gameObject.xCoord, gameObject.yCoord + 2);
    this.ctx.lineTo(gameObject.xCoord + 10, gameObject.yCoord + 2);
    this.ctx.lineTo(gameObject.xCoord + 5, gameObject.yCoord - 7);
    this.ctx.lineTo(gameObject.xCoord, gameObject.yCoord + 2);
    this.ctx.fillStyle = gameObject.color
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
    this.ctx.fillStyle = gameObject.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawEnemy(gameObject) {
    //BODY
    this.ctx.beginPath();
    this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
    this.ctx.fillStyle = gameObject.color;
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    /////EYES
    //left
    this.ctx.beginPath();
    this.ctx.arc(gameObject.xCoord + (gameObject.xDimension / 4), gameObject.yCoord + (gameObject.xDimension / 4), gameObject.xDimension / 10, 0, 2 * Math.PI);
    this.ctx.fillStyle = "yellow";
    this.ctx.fill();
    //right
    this.ctx.beginPath();
    this.ctx.arc(gameObject.xCoord + (gameObject.xDimension / 1.5), gameObject.yCoord + (gameObject.xDimension / 4), gameObject.xDimension / 10, 0, 2 * Math.PI);
    this.ctx.fillStyle = "yellow";
    this.ctx.fill();

    /////TEETH
    //left
    this.ctx.beginPath();
    this.ctx.moveTo(gameObject.xCoord + (gameObject.xDimension / 5), gameObject.yCoord + (gameObject.yDimension / 2) );
    this.ctx.lineTo(gameObject.xCoord + (gameObject.xDimension / 3), gameObject.yCoord + (gameObject.yDimension / 2));
    this.ctx.lineTo(gameObject.xCoord + (gameObject.xDimension / 4), gameObject.yCoord + (gameObject.yDimension / 1.3));
    this.ctx.lineTo(gameObject.xCoord + (gameObject.xDimension / 5), gameObject.yCoord + (gameObject.yDimension / 2));
    this.ctx.fillStyle = "white"
    this.ctx.fill();
    //right
    this.ctx.beginPath();
    this.ctx.moveTo(gameObject.xCoord + (gameObject.xDimension / 1.6), gameObject.yCoord + (gameObject.yDimension / 2) );
    this.ctx.lineTo(gameObject.xCoord + (gameObject.xDimension / 1.3), gameObject.yCoord + (gameObject.yDimension / 2));
    this.ctx.lineTo(gameObject.xCoord + (gameObject.xDimension / 1.5), gameObject.yCoord + (gameObject.yDimension / 1.3));
    this.ctx.lineTo(gameObject.xCoord + (gameObject.xDimension / 1.6), gameObject.yCoord + (gameObject.yDimension / 2));
    this.ctx.fillStyle = "white"
    this.ctx.fill();
  }

  //PLACE OBJECTS FROM ARRAY
  placeObject(gameObject) {

    if(gameObject.type === "tree") {
      this.drawTree(gameObject);
    } else if (gameObject.type === 'mountain') {
      this.drawMountain(gameObject);
    } else if (gameObject.type === "item") {
      this.ctx.beginPath();
      this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
      this.ctx.fillStyle = gameObject.color;
      this.ctx.fill();
      this.ctx.closePath();
    } else if (gameObject.type === "village") {
      this.drawVillage(gameObject);
    } else if (gameObject.type === "building"){
      this.drawBuilding(gameObject);
    } else {
      this.drawEnemy(gameObject);
    }
  }

// ANIMATIONS //////////////////////////////////////////////////////////////////
  swingSouthAnimation() {
    let current = this;
    var southSwingArray = [[((current.canvas.width / 2) - 5), ((current.canvas.height / 2) + 5), 3, 5], [((current.canvas.width / 2) - 5), ((current.canvas.height / 2) + 7), 3, 5]];
    current.ctx.rect(southSwingArray[this.southSwingCounter][0], southSwingArray[this.southSwingCounter][1], southSwingArray[this.southSwingCounter][2], southSwingArray[this.southSwingCounter][3]);
    this.southSwingCounter += 1
    if (this.southSwingCounter === 2) {
      this.southSwingCounter = 0;
    }
  }

  drawRectangle(xCoord: number, yCoord: number, xDimension: number, yDimension: number, color: string) {
    this.ctx.beginPath();
    this.ctx.rect(xCoord, yCoord, xDimension, yDimension);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawCustomRectangle(frame) {
    let point1 = [frame.xCoord, frame.yCoord];
    let point2 = [(frame.xCoord + Math.cos(frame.attackAngle)*frame.yDimension), (frame.yCoord + Math.sin(frame.attackAngle)*frame.yDimension)];
    let point3 = [(frame.xCoord + Math.cos(.5-frame.attackAngle)*frame.xDimension), (frame.yCoord - Math.sin(.5-frame.attackAngle)*frame.xDimension)];
    let point4 = [point2[0] + (point1[0] - point3[0]), point2[1] + (point1[1] - point3[1])];
    this.ctx.beginPath();
    this.ctx.moveTo(frame.xCoord, frame.yCoord);
    this.ctx.lineTo(point3[0], point3[1]);
    this.ctx.lineTo(point2[0], point2[1]);
    this.ctx.lineTo(point4[0], point4[1]);
    this.ctx.fillStyle = frame.color;
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }

  generateAttackAnimation(attacking: boolean) {
    let current = this;
    var attackRectangle = {
      // each array will be: [starting xCoord, starting yCoord, xDimension, yDimension]
      south: [((current.canvas.width / 2) - 5), ((current.canvas.height / 2)), 5, 15, .7],
      north: [((current.canvas.width / 2) + 4), ((current.canvas.height / 2)), 5, 15, -2.3],
      west: [((current.canvas.width / 2)), ((current.canvas.height / 2) - 4), 5, 15, 2.3],
      east: [((current.canvas.width / 2)), ((current.canvas.height / 2) + 4), 5, 15, -.7]
    }
    if (attacking) {
      let xCoord = attackRectangle[current.player.direction][0];
      let yCoord = attackRectangle[current.player.direction][1];
      let point1 = [xCoord, yCoord];
      let newFrameSet = [];
      let handFrame = [];
      let angleAduster = 0;
      for (let index = 1; index <= 9; index++) {
        // Frames for sword attack
        let newAnimation = new GameObject('animation');
        newAnimation.setProperties(attackRectangle[current.player.direction][0], attackRectangle[current.player.direction][1], attackRectangle[current.player.direction][2], attackRectangle[current.player.direction][3], current.player.mainHand.color);
        newAnimation.attackAngle = attackRectangle[current.player.direction][4] + angleAduster;
        newAnimation.collidable = false;
        newFrameSet.push(newAnimation);
        angleAduster += .15;
      }
      current.animationsArray.push(newFrameSet);
    }
  }

  playAnimation(frameSet) {
    for (let index = 0; index < frameSet.length; index++) {
      let newFrame = frameSet[index][0];
      frameSet[index].shift();
      if (frameSet[index].length === 0) {
        frameSet.splice(index, 1);
      }
      this.drawCustomRectangle(newFrame);
    }
  }

  gameLoop() {
    var current = this;
    var attacking: boolean = false;
    var healthTick = 0;
    var gameTick = setInterval(function(){
      current.velocityVector = [0,0];
      ///////////CONTROLS////////////
      //UP
      if (current.keyState[38] || current.keyState[87]){
        current.velocityVector[1] += 1.5;
        current.player.direction = "north";
      }
      //DOWN
      if (current.keyState[40] || current.keyState[83]){
        current.velocityVector[1] += -1.5;
        current.player.direction = "south";

      }
      //LEFT
      if (current.keyState[37] || current.keyState[65]){
        current.velocityVector[0] += 1.5;
        current.player.direction = "west";

      }
      //RIGHT
      if (current.keyState[39] || current.keyState[68]){
        current.velocityVector[0] += -1.5;
        current.player.direction = "east";
      }
      //ATTACK
      if (current.keyState[32]){
        if(attacking === false) {
          current.attack();
          attacking = true;
          current.generateAttackAnimation(attacking);
          setTimeout(function(){
            attacking = false;
          }, 500);
        }
      }

      //MOVE GAME WORLD
      // check for collisions
      current.checkCollisions();
      for(let gameObject of current.objectsArray) {
        if(gameObject.type === "enemy") {
          current.enemyAggro(gameObject);
        }
        gameObject.move(current.velocityVector);
      }
      // CLEAR THE CANVAS
    current.ctx.clearRect(0, 0, current.canvas.width, current.canvas.height);

    for(let object of current.objectsArray){
      current.placeObject(object);
    }

    //Player attack animations(NEEDS REFACTOR)
    current.playAnimation(current.animationsArray);

    //REFERENCE
    //current.ctx.rect(xCoord, yCoord, xDimension, yDimension)   ;

    // Player rebuild
    current.ctx.beginPath();
    current.ctx.rect(((current.canvas.width / 2) - 5), ((current.canvas.height / 2) - 5), 10, 10);
    current.ctx.fillStyle = "blue";
    current.ctx.fill();
    current.ctx.closePath();
    current.ctx.beginPath();
    current.ctx.moveTo(((current.canvas.width / 2) - 5), ((current.canvas.height / 2) - 5) + 2);
    current.ctx.lineTo(((current.canvas.width / 2) - 5) + 10, ((current.canvas.height / 2) - 5) - 2);
    current.ctx.lineTo(((current.canvas.width / 2) - 5) + 5, ((current.canvas.height / 2) - 5) - 2);
    current.ctx.lineTo(((current.canvas.width / 2) - 5), ((current.canvas.height / 2) - 5) + 2);
    current.ctx.fillStyle = "white"
    current.ctx.fill();
    current.ctx.closePath();
    if(current.player.chestSlot.name != "Nothing") {
      current.ctx.beginPath();
      current.ctx.rect(((current.canvas.width / 2) - 5), ((current.canvas.height / 2) -2), 10, 3);
      current.ctx.fillStyle = current.player.chestSlot.color;
      current.ctx.fill();
      current.ctx.closePath();
    }
    if(current.player.legSlot.name != "Nothing") {
      current.ctx.beginPath();
      current.ctx.rect(((current.canvas.width / 2) - 5), ((current.canvas.height / 2) + 1), 10, 4);
      current.ctx.fillStyle = current.player.legSlot.color;
      current.ctx.fill();
      current.ctx.closePath();
    }
    if(current.player.headSlot.name != "Nothing") {
      current.ctx.beginPath();
      current.ctx.rect(((current.canvas.width / 2) - 5), ((current.canvas.height / 2) - 5), 10, 2);
      current.ctx.fillStyle = current.player.headSlot.color;
      current.ctx.fill();
      current.ctx.closePath();
    }


    //Check character death PLACEHOLDER GAME OVER EVENT
    if(current.player.health <= 0) {
      clearInterval(gameTick);
      current.ctx.font = "10px Arial";
      current.ctx.fillText("GAME OVER, REFRESH TO RESTART",10,50);
    }
    current.invisibleX -= current.velocityVector[0];
    current.invisibleY -= current.velocityVector[1];

    healthTick++;
    if(healthTick > 200)
    {
      current.player.health++;
      healthTick = 0;
    }
  }, 20);
  }
}
