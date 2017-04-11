import { Component, OnInit } from '@angular/core';
import { GameObject, Enemy } from './game-object.model';
import { Player } from './player.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  keyState = {};
  title = 'Square Heroes';
  objectsArray = [];
  canvas = null;
  ctx = null;
  player = null;
  velocityVector: number[] = [0,0];

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
    this.generateWorld();
  }

  /////////WORLD GENERATION/////////
  generateWorld() {
    //Trees
    var numberOfTrees = Math.floor(Math.random() * (Math.floor(40) - Math.ceil(20)) + Math.ceil(20));
    for(var i = 0; i < numberOfTrees; i++) {
      this.objectsArray.push(new GameObject("tree"));
    }
    //Enemies
    var numberOfEnemies = Math.floor(Math.random() * (Math.floor(40) - Math.ceil(20)) + Math.ceil(20))

    for(var i = 0; i < numberOfEnemies; i++) {
      this.objectsArray.push(new Enemy("enemy"));
    }
    this.gameLoop();
  }

  //////////ATTACK//////////////
  attack() {
    console.log("Attack at direction " + this.player.direction)
    this.player.getXAttack();
    this.player.getYAttack();
    for(var i = 0; i < this.objectsArray.length; i++) {

      //COLLISION DETETION
      if( this.objectsArray[i].xCoord < (this.canvas.width / 2 - 5) + this.player.xAttack + this.player.xDimension && this.objectsArray[i].xCoord + this.objectsArray[i].xDimension > (this.canvas.width / 2 - 5) + this.player.xAttack && this.objectsArray[i].yCoord < (this.canvas.height / 2 - 5) + this.player.yAttack + this.player.yDimension && this.objectsArray[i].yDimension + this.objectsArray[i].yCoord > (this.canvas.height / 2 - 5) + this.player.yAttack) {
        //COLLISION FOUND
          if(this.objectsArray[i].type === "enemy") {
            //ENEMY IS BEING ATTACKED
            //ATTACK AND DAMAGE ROLLS FOR COMBAT
            //ATTACK ROLL
            var atkRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(1)) + Math.ceil(1));
            console.log(atkRoll + ' atk roll');
            if(atkRoll > (50 - this.player.attackLvl))
            {
              //DAMAGE ROLL
              var dmgRoll = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(0)) + Math.ceil(0));
              console.log(dmgRoll + ' dmg roll')
              if(dmgRoll != 0)
              {
                dmgRoll = dmgRoll + (this.player.strengthLvl * 2);
                this.objectsArray[i].health -= dmgRoll;
                console.log(this.objectsArray[i].health);
              }
            }
            //DEATH OF ENEMY
            if(this.objectsArray[i].health < 0) {
              var xCoord: number = this.objectsArray[i].xCoord;
              var yCoord: number = this.objectsArray[i].yCoord;
              this.objectsArray.splice(i, 1);
              // DROPROLL CHANCE
              var dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
              if (dropRoll < 100) {
                dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
                if (dropRoll < 100) {
                  dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
                  if (dropRoll < 100) {

                    this.objectsArray.push(new GameObject("item"));
                    this.objectsArray[this.objectsArray.length-1].xCoord = xCoord +1
                    this.objectsArray[this.objectsArray.length-1].yCoord = yCoord +1
                    console.log("Your Drop Is an Atk!:");
                  } else if (dropRoll < 50) {
                    var newItem = new GameObject("item");
                    newItem.xCoord = xCoord;
                    newItem.yCoord = yCoord;
                    this.objectsArray.push(newItem);
                    console.log("Your Drop Is a Str!:");
                  } else if (dropRoll < 75) {
                    var newItem = new GameObject("item");
                    newItem.xCoord = xCoord;
                    newItem.yCoord = yCoord;
                    this.objectsArray.push(newItem);
                    console.log("Your Drop Is a Def!:");
                  } else {
                    var newItem = new GameObject("item");
                    newItem.xCoord = xCoord;
                    newItem.yCoord = yCoord;
                    this.objectsArray.push(newItem);
                    console.log("Your Drop Is a Hp!:");
                  }
                } else {
                  dropRoll = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(0)) + Math.ceil(0));
                  if (dropRoll < 25) {
                    var newItem = new GameObject("item");
                    newItem.xCoord = xCoord;
                    newItem.yCoord = yCoord;
                    this.objectsArray.push(newItem);
                    console.log("Your Drop Is a Helm!:");
                  } else if (dropRoll < 50) {
                    var newItem = new GameObject("item");
                    newItem.xCoord = xCoord;
                    newItem.yCoord = yCoord;
                    this.objectsArray.push(newItem);
                    console.log("Your Drop Is a Plate!:");
                  } else if (dropRoll < 75) {
                    var newItem = new GameObject("item");
                    newItem.xCoord = xCoord;
                    newItem.yCoord = yCoord;
                    this.objectsArray.push(newItem);
                    console.log("Your Drop Is a Greves!:");
                  } else {
                    var newItem = new GameObject("item");
                    newItem.xCoord = xCoord;
                    newItem.yCoord = yCoord;
                    this.objectsArray.push(newItem);
                    console.log("Your Drop Is a Wep!:");
                  }
                }
                console.log(this.objectsArray[this.objectsArray.length - 1])
                console.log(xCoord + " " + yCoord)
                console.log(this.objectsArray[this.objectsArray.length - 1].xCoord + " " + this.objectsArray[this.objectsArray.length - 1].yCoord)
              } else {
                console.log("Your Drop Is A None!");
              }
            }
          } else {
            //TREE IS BEING ATTACKED
            this.objectsArray.splice(i, 1);
          }
      }
    }
  }

  //PLACE OBJECTS FROM ARRAY
  placeObject(gameObject: GameObject) {
    if(gameObject.type === "tree") {
      this.ctx.beginPath();
      this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
      this.ctx.fillStyle = "green";
      this.ctx.fill();
      this.ctx.closePath();
    } else if (gameObject.type === "item") {
      console.log(gameObject)
      this.ctx.beginPath();
      this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
      this.ctx.fillStyle = "yellow";
      this.ctx.fill();
      this.ctx.closePath();
    } else {
      this.ctx.beginPath();
      this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
      this.ctx.fillStyle = "red";
      this.ctx.fill();
      this.ctx.closePath();
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
      for(let gameObject of current.objectsArray) {
        gameObject.move(current.velocityVector)
      }
    current.ctx.clearRect(0, 0, current.canvas.width, current.canvas.height);

    for(let object of current.objectsArray){
      current.placeObject(object);
    }

    //Player attack animations(NEEDS REFACTOR)

    if(attacking && current.player.direction === "south") {
        current.ctx.beginPath();
        current.ctx.rect(((current.canvas.width / 2) - 5), ((current.canvas.height / 2) + 5), 3, 8);
        current.ctx.fillStyle = "blue";
        current.ctx.fill();
        current.ctx.closePath();
    }

    if(attacking && current.player.direction === "north") {
        current.ctx.beginPath();
        current.ctx.rect(((current.canvas.width / 2) + 2), ((current.canvas.height / 2) - 10), 3, 8);
        current.ctx.fillStyle = "blue";
        current.ctx.fill();
        current.ctx.closePath();
    }

    if(attacking && current.player.direction === "west") {
        current.ctx.beginPath();
        current.ctx.rect(((current.canvas.width / 2) - 10), ((current.canvas.height / 2) + 2), 8, 3);
        current.ctx.fillStyle = "blue";
        current.ctx.fill();
        current.ctx.closePath();
    }

    if(attacking && current.player.direction === "east") {
        current.ctx.beginPath();
        current.ctx.rect(((current.canvas.width / 2) + 5), ((current.canvas.height / 2) + 2), 8, 3);
        current.ctx.fillStyle = "blue";
        current.ctx.fill();
        current.ctx.closePath();
    }

    // Player rebuild
    current.ctx.beginPath();
    current.ctx.rect(((current.canvas.width / 2) - 5), ((current.canvas.height / 2) - 5), 10, 10);
    current.ctx.fillStyle = "blue";
    current.ctx.fill();
    current.ctx.closePath();
  }, 20);
  }
}
