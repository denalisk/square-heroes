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
  newVillage;



  //////////CONSTRUCTOR/////////////////
  constructor(private http: Http) {}

  // API CALLS
  searchquery = '';
  tweetsdata;

  makecall() {
    let headers = new Headers();

    // Below looks like something is wrong
    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    // Below looks to be the main post call. Do we need a /authorize route?
    this.http.post('http://localhost:3000/authorize', {headers: headers}).subscribe((results) => {console.log(results);
    })
  }

  searchcall(){
    var headers = new Headers();
    var searchterm = 'query=' + this.searchquery;

    headers.append('Content-Type', 'application/X-www-form-urlencoded');
    // headers.append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');

    this.http.post('http://localhost:3000/search', searchterm, {headers: headers}).subscribe((res) => {
      this.tweetsdata = res.json().data.statuses;
    });
  }

  // COLLISION DETECTION
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
              current.player.inventory.push(current.objectsArray[index].userItem);
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
        this.player.damageModifier += 2;
      }else if(stat === "defense")
      {
        this.player.defenseLvl += 1;
        this.player.health += 20;
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
      } else if(item.stat[i] === "defense")
      {
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
      } else if(item.stat[i] === "defense")
      {
        this.player.defenseLvl -= item.bonus[i];
      }
    }
  }

  //EQUIPING AND USING ITEMS
  useItem(item: UserItem) {
    if(item.type === "consumable") {


    } else if(item.type === "headSlot") {
      //UNEQUIP GEAR, SET STATS CORRECTLY, THEN EQUIP NEW GEAR
      // if(item.name === "Mithril Helm") {
      //
      // }
      this.unequipGear(this.player.headSlot);
      this.equipGear(item);
      this.player.headSlot = item;
    } else if(item.type === "chestSlot") {
      //UNEQUIP GEAR, SET STATS CORRECTLY, THEN EQUIP NEW GEAR
      this.unequipGear(this.player.chestSlot);
      this.equipGear(item);
      this.player.chestSlot = item;
    } else if(item.type === "legSlot") {
      //UNEQUIP GEAR, SET STATS CORRECTLY, THEN EQUIP NEW GEAR
      this.unequipGear(this.player.legSlot);
      this.equipGear(item);
      this.player.legSlot = item;
    } else if(item.type === "mainHand") {
      if(this.player.offHand.type === "duoSet") {
        this.unequipGear(this.player.offHand);
        this.player.offHand = new UserItem("Nothing", "offHand", [0], ["Nothing"]);
      }
      this.unequipGear(this.player.mainHand);
      this.equipGear(item);
      this.player.mainHand = item;
    } else if(item.type === "offHand") {
      if(this.player.mainHand.type === "duoSet") {
        this.unequipGear(this.player.mainHand);
        this.player.mainHand = new UserItem("Nothing", "offHand", [0], ["Nothing"]);
      }
      else if(this.player.mainHand.type === "twoHander") {
        this.unequipGear(this.player.mainHand);
        this.player.mainHand = new UserItem("Nothing", "mainHand", [0], ["Nothing"]);
      }
      this.unequipGear(this.player.offHand);
      this.equipGear(item);
      this.player.offHand = item;
    } else if(item.type === "twoHander") {
      this.unequipGear(this.player.mainHand);
      this.unequipGear(this.player.offHand);
      this.equipGear(item);
      this.player.mainHand = item;
      this.player.offHand = new UserItem("Nothing", "offHand", [0], ["Nothing"]);
    } else if(item.type === "duoSet") {
      this.unequipGear(this.player.mainHand);
      this.unequipGear(this.player.offHand);
      this.player.mainHand = item;
      this.player.offHand = item;
      this.equipGear(this.player.mainHand);
      this.equipGear(this.player.offHand);
    }
  }

  //USE POTIONS
  useHealthPot() {
    if(this.player.healthPotions > 0)
    {
      this.player.health += 50;
      this.player.healthPotions -= 1;
    }
  }
  useStrengthPot() {
    if(this.player.strengthPotions > 0)
    {
      this.player.strengthLvl += 50;
      this.player.strengthPotions -= 1;
    }
  }
  useAttackPot() {
    if(this.player.attackPotions > 0)
    {
      this.player.attackLvl += 50;
      this.player.attackPotions -= 1;
    }
  }
  useDefensePot() {
    if(this.player.defensePotions > 0)
    {
      this.player.defenseLvl += 50;
      this.player.defensePotions -= 1;
    }
  }

  //////INITIALIZATION///////
  ngOnInit() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    window.addEventListener('keydown',(e) => {
        this.keyState[e.keyCode || e.which] = true;
    },true);
    window.addEventListener('keyup', (e) => {
        this.keyState[e.keyCode || e.which] = false;
    },true);

    this.player = new Player();
    this.player.godMode(1000, 1000, 10, 10000);
    this.playerXCoord = ((this.canvas.width / 2) - 5);
    this.playerYCoord = ((this.canvas.height / 2) - 5);
    this.generateWorld();
  }

  /////////WORLD GENERATION/////////
  generateWorld() {
    //Village
    this.newVillage = new Village("village");
    this.newVillage.setProperties(-800, 170, 500, 500, "gray")
    this.objectsArray.push(this.newVillage);

    for(let i = 0; i < this.newVillage.buildings; i++) {
      var newBuilding = new Building("building", this.newVillage);
      this.objectsArray.push(newBuilding);
    }

    this.generateBoss()

    //Trees
    var numberOfTrees = Math.floor(Math.random() * (Math.floor(40) - Math.ceil(20)) + Math.ceil(20));
    for(var i = 0; i < numberOfTrees; i++) {
      this.objectsArray.push(new GameObject("tree"));
    }
    //Mountains
    for (let index = 0; index < 10; index++) {
      this.generateMountain();
    }
    //Enemies
    var numberOfEnemies = Math.floor(Math.random() * (Math.floor(40) - Math.ceil(20)) + Math.ceil(20))

    for(var i = 0; i < numberOfEnemies; i++) {
      this.objectsArray.push(new Enemy("enemy"));
    }

    this.gameLoop();
  }

  generateBoss() {
    //Add BOSS to village
    var bossEnemy = new Enemy('enemy');
    bossEnemy.setProperties((this.newVillage.xCoord + (this.newVillage.xDimension/2)), (this.newVillage.yCoord + (this.newVillage.yDimension/2)), 50, 50, "#6b245f");
    console.log("Boss spawned at: " + bossEnemy.xCoord + ", " + bossEnemy.yCoord);
    this.objectsArray.push(bossEnemy);
    //BOSS Minions
    for(let i = 10; i < 100; i += 10) {
      var bossMinion = new Enemy('enemy');
      bossMinion.setProperties((this.newVillage.xCoord + (this.newVillage.xDimension/2) + i), (this.newVillage.yCoord + (this.newVillage.yDimension/2) + i), 10, 10, "#774f9b");
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
    var highArray: UserItem[] = [new UserItem("Health Potion", "consumable", [30], ["health"]), new UserItem("Strength Potion", "consumable", [30], ["strength"]), new UserItem("Attack Potion", "consumable", [30], ["attack"]), new UserItem("Defense Potion", "consumable", [30], ["defense"])];
    var lowGear: UserItem[] = [new UserItem("Iron Helm", "headSlot", [15], ["defense"]), new UserItem("Iron Chestplate", "chestSlot", [30], ["defense"]), new UserItem("Iron Greves", "legSlot", [20], ["defense"]), new UserItem("Sword", "mainHand", [20, 20], ["strength", "attack"]), new UserItem("Shield", "offHand", [40], ["defense"]), new UserItem("Claymore", "twoHander", [75], ["strength"])];
    var medGear: UserItem[] = [new UserItem("Mithril Helm", "headSlot", [40], ["defense"]), new UserItem("Mithril Chestplate", "chestSlot", [55], ["defense"]), new UserItem("Mithril Greves", "legSlot", [45], ["defense"]), new UserItem("Katana", "twoHander", [60, 180], ["attack", "strength"]), new UserItem("Nunchucks", "duoSet", [180, 60], ["attack", "strength"]), new UserItem("MH Scimitar", "mainHand", [110, 110], ["attack", "strength"]), new UserItem("OH Scimitar", "offHand", [110, 110], ["attack", "strength"])];
    var rareGear: UserItem[] = [new UserItem("Robinhood Hat", "headSlot", [250], ["attack"]), new UserItem("Gladiator Chestplate", "chestSlot", [250], ["strength"]), new UserItem("MH Kitten Bomb", "mainHand", [200, 200], ["attack", "strength"]), new UserItem("OH Kitten Bomb", "offHand", [200, 200], ["attack", "strength"])];
    var epicGear: UserItem[] = [new UserItem("Chad Legs(ULTIMA)", "legSlot", [300], ["attack"]),  new UserItem("Blue Light Saber", "mainHand", [300, 300], ["attack", "strength"]), new UserItem("Green Light Saber", "offHand", [300, 300], ["attack", "strength"]), new UserItem("Illidan's Warglaive", "twoHander", [500, 100], ["attack", "strength"])];

    var newItem = new Item("item");

    newItem.xCoord = xCoord;
    newItem.yCoord = yCoord;
    newItem.yDimension = 5;
    newItem.xDimension = 5;

    if(thing === "high") {
      roll = Math.floor(Math.random() * (Math.floor(highArray.length-1) - Math.ceil(0)) + Math.ceil(0));
      newItem.userItem = highArray[roll];
    } else {
      var selectDropTable = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
      if(selectDropTable >= 0 && 60 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(lowGear.length-1) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = lowGear[roll];
      } else if(selectDropTable >= 60 && 85 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(medGear.length-1) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = medGear[roll];
      } else if(selectDropTable >= 85 && 95 > selectDropTable) {
        roll = Math.floor(Math.random() * (Math.floor(rareGear.length-1) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = rareGear[roll];
      } else if(selectDropTable >= 95) {
        roll = Math.floor(Math.random() * (Math.floor(epicGear.length-1) - Math.ceil(0)) + Math.ceil(0));
        newItem.userItem = epicGear[roll];
      }
    }

    this.objectsArray.push(newItem);
    console.log("You Got a " + newItem.userItem.name + " drop")
  }


  //RESPAWN
  respawn() {
    var current = this;
    setTimeout(function() {
      current.objectsArray.push(new Enemy("enemy"));
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
            this.atkRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(1)) + Math.ceil(1));
            console.log(this.atkRoll + ' atk roll');
            if(this.atkRoll > (50 - this.player.attackLvl))
            {
              this.hitBool = true;
              //DAMAGE ROLL
              this.dmgRoll = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(0)) + Math.ceil(0));
              console.log(this.dmgRoll + ' dmg roll');
              if(this.dmgRoll != 0)
              {
                this.damageDone = this.dmgRoll + (this.player.strengthLvl * 2);
                console.log(this.damageDone + ' damage done');
                this.objectsArray[i].health -= this.damageDone;
                console.log(this.objectsArray[i].health + ' enemy health');
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
              } else {
                this.respawn();
              }
              var xCoord: number = this.objectsArray[i].xCoord;
              var yCoord: number = this.objectsArray[i].yCoord;
              //EXPERIENCE DROP
              var expDrop = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(5)) + Math.ceil(5));
              this.player.experience += expDrop;
              //LEVEL UP
              //EVERY LEVEL, EXPERIENCE NEEDED TO LEVEL UP IS DOUBLED
              if(this.player.experience >= (this.player.level * 30))
              {
                //LEVEL GAIN
                this.player.level += 1;
                //SKILL POINT GAIN
                this.player.skillPoints += 2;
                //RESET EXPERIENCE
                this.player.experience = 0;
              }

              this.objectsArray.splice(i, 1);
              // DROPROLL CHANCE
              var dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
              if (dropRoll < 40) {
                if (dropRoll < 30) {
                  this.generateItem(xCoord, yCoord, 'high');
                } else {
                  this.generateItem(xCoord, yCoord, 'low');
                }
              } else {
                console.log("nope")
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
      var enemyDamage = enemy.rollForDamage() - this.player.defenseLvl;
      if(enemyDamage > 0) {
        this.player.health -= enemy.rollForDamage() - this.player.defenseLvl;
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
          //ENEMY IS IN ATTACK RANGE
          this.enemyAttack(enemy);
          vector = [0, 0];
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


  //PLACE OBJECTS FROM ARRAY
  placeObject(gameObject) {

    if(gameObject.type === "tree") {
      this.drawTree(gameObject);
    } else if (gameObject.type === 'mountain') {
      this.drawMountain(gameObject);
    } else if (gameObject.type === "item") {
      this.ctx.beginPath();
      this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
      this.ctx.fillStyle = "yellow";
      this.ctx.fill();
      this.ctx.closePath();
    } else if (gameObject.type === "village") {
      this.drawVillage(gameObject);
    } else if (gameObject.type === "building"){
      this.drawBuilding(gameObject);
    } else {
      this.ctx.beginPath();
      this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
      this.ctx.fillStyle = gameObject.color;
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

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
    let point2 = [(frame.xCoord + Math.cos(frame.angle)*frame.yDimension), (frame.yCoord + Math.sin(frame.angle)*frame.yDimension)];
    let point3 = [(frame.xCoord + Math.cos(.5-frame.angle)*frame.xDimension), (frame.yCoord - Math.sin(.5-frame.angle)*frame.xDimension)];
    let point4 = [point2[0] + point3[0], point2[1] - point3[1]];
    this.ctx.beginPath();
    this.ctx.moveTo(frame.xCoord, frame.yCoord);
    this.ctx.lineTo(point2[0], point2[1]);
    this.ctx.lineTo(point3[0], point3[1]);
    this.ctx.lineTo(point4[0], point4[1]);
    this.ctx.fillStyle = frame.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  attackAnimation(attacking: boolean) {
    let current = this;
    var attackRectangle = {
      // each array will be: [starting xCoord, starting yCoord, xDimension, yDimension]
      south: [((current.canvas.width / 2) - 5), ((current.canvas.height / 2) + 5), 3, 5],
      north: [((current.canvas.width / 2) + 2), ((current.canvas.height / 2) - 10), 3, 5],
      west: [((current.canvas.width / 2) - 10), ((current.canvas.height / 2) - 5), 5, 3],
      east: [((current.canvas.width / 2) + 5), ((current.canvas.height / 2) + 2), 5, 3]
    }
    if (attacking) {
      let xCoord = attackRectangle[current.player.direction][0];
      let yCoord = attackRectangle[current.player.direction][1];
      let point1 = [xCoord, yCoord];
      let newFrameSet = [];
      for (let index = .1; index <= .5; index += .1) {
        let newAnimation = new GameObject('animation');
        newAnimation.setProperties(attackRectangle[current.player.direction][0], attackRectangle[current.player.direction][1], attackRectangle[current.player.direction][2], attackRectangle[current.player.direction][3], 'yellow');
        newAnimation.attackAngle = index;
        newFrameSet.push(newAnimation);
      }
      current.animationsArray.push(newFrameSet);
      console.log(newFrameSet);
      console.log(current.animationsArray);
    }
  }

  playAnimation(frameSet) {
    for (let animation of frameSet) {
      let newFrame = animation[0];
      animation.shift();
      this.drawCustomRectangle(newFrame);
    }
  }

  gameLoop() {
    var current = this;
    var attacking: boolean = false;
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
          setTimeout(function(){
            attacking = false;
          }, 500);
        }
      }

      //MOVE GAME WORLD
      // check for collisions
      current.checkCollisions();
      for(let gameObject of current.objectsArray) {
        gameObject.move(current.velocityVector);
        if(gameObject.type === "enemy") {
          current.enemyAggro(gameObject);
        }
      }
      // CLEAR THE CANVAS
    current.ctx.clearRect(0, 0, current.canvas.width, current.canvas.height);

    for(let object of current.objectsArray){
      current.placeObject(object);
    }

    //Player attack animations(NEEDS REFACTOR)

    //REFERENCE
    //current.ctx.rect(xCoord, yCoord, xDimension, yDimension)   ;

    current.attackAnimation(attacking);
    current.playAnimation(current.animationsArray);

    // Player rebuild
    current.ctx.beginPath();
    current.ctx.rect(((current.canvas.width / 2) - 5), ((current.canvas.height / 2) - 5), 10, 10);
    current.ctx.fillStyle = "blue";
    current.ctx.fill();
    current.ctx.closePath();

    //Check character death PLACEHOLDER GAME OVER EVENT
    if(current.player.health <= 0) {
      clearInterval(gameTick);
      current.ctx.font = "10px Arial";
      current.ctx.fillText("GAME OVER, REFRESH TO RESTART",10,50);
    }
  }, 20);
  }
}
