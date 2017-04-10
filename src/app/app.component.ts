import { Component, OnInit } from '@angular/core';
import { GameObject } from './game-object.model';
import { Player } from './player.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  keyState = {};
  title = 'Square Heroes';
  objectsArray: GameObject[] = [];
  canvas = null;
  ctx = null;
  player = null;
  velocityVector: number[] = [0,0];

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

  generateWorld() {
    //Trees
    var numberOfTrees = Math.floor(Math.random() * (Math.floor(40) - Math.ceil(30)) + Math.ceil(30));
    for(var i = 0; i < numberOfTrees; i++) {
      this.objectsArray.push(new GameObject("tree"));
    }
    //Enemies
    var numberOfEnemies = Math.floor(Math.random() * (Math.floor(30) - Math.ceil(20)) + Math.ceil(20))

    for(var i = 0; i < numberOfEnemies; i++) {
      this.objectsArray.push(new GameObject("enemy"));
    }
    this.gameLoop();
  }

  attack(){
    console.log("Attack at direction " + this.player.direction)
    for(var i = 0; i < this.objectsArray.length; i++) {
      console.log(this.objectsArray[i]);
      if(this.player.direction === "north") {
        if( this.objectsArray[i].xCoord < this.player.xCoord + this.player.xDimension &&
          this.objectsArray[i].xCoord + this.objectsArray[i].xDimension > this.player.xCoord &&
          this.objectsArray[i].yCoord < this.player.yCoord + this.player.yDimension &&
          this.objectsArray[i].yDimension + this.objectsArray[i].yCoord > this.player.yCoord) {
            console.log("Collision!");
            this.objectsArray.slice(i, 1);
        }
      }

      if(this.player.direction === "south") {
        if( this.objectsArray[i].xCoord < this.player.xCoord + this.player.xDimension &&
          this.objectsArray[i].xCoord + this.objectsArray[i].xDimension > this.player.xCoord &&
          this.objectsArray[i].yCoord < this.player.yCoord + this.player.yDimension &&
          this.objectsArray[i].yDimension + this.objectsArray[i].yCoord > this.player.yCoord) {
            console.log("Collision!");
            this.objectsArray.slice(i, 1);
        }
      }

      if(this.player.direction === "east") {
        if( this.objectsArray[i].xCoord < this.player.xCoord + this.player.xDimension &&
          this.objectsArray[i].xCoord + this.objectsArray[i].xDimension > this.player.xCoord &&
          this.objectsArray[i].yCoord < this.player.yCoord + this.player.yDimension &&
          this.objectsArray[i].yDimension + this.objectsArray[i].yCoord > this.player.yCoord) {
            console.log("Collision!");
            this.objectsArray.slice(i, 1);
        }
      }

      if(this.player.direction === "west") {
        if( this.objectsArray[i].xCoord < this.player.xCoord + this.player.xDimension &&
          this.objectsArray[i].xCoord + this.objectsArray[i].xDimension > this.player.xCoord &&
          this.objectsArray[i].yCoord < this.player.yCoord + this.player.yDimension &&
          this.objectsArray[i].yDimension + this.objectsArray[i].yCoord > this.player.yCoord - 5) {
            console.log("Collision!");
            this.objectsArray.slice(i, 1);
        }
      }
    }
  }


  placeObject(gameObject: GameObject) {
    if(gameObject.type === "tree") {
      this.ctx.beginPath();
      this.ctx.rect(Math.floor(gameObject.xCoord), Math.floor(gameObject.yCoord), Math.floor(gameObject.xDimension), Math.floor(gameObject.yDimension));
      this.ctx.fillStyle = "green";
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
    var gameTick = setInterval(function(){
      current.velocityVector = [0,0];
      if (current.keyState[38] || current.keyState[87]){
        current.velocityVector[1] += 1.5;
        current.player.direction = "north";
      }

      if (current.keyState[40] || current.keyState[83]){
        current.velocityVector[1] += -1.5;
        current.player.direction = "south";

      }
      if (current.keyState[37] || current.keyState[65]){
        current.velocityVector[0] += 1.5;
        current.player.direction = "west";

      }
      if (current.keyState[39] || current.keyState[68]){
        current.velocityVector[0] += -1.5;
        current.player.direction = "east";
      }

      if (current.keyState[32]){
        current.attack();
      }

      for(let gameObject of current.objectsArray) {
        gameObject.move(current.velocityVector)
      }
    current.ctx.clearRect(0, 0, current.canvas.width, current.canvas.height);

    for(let object of current.objectsArray){
      current.placeObject(object);
    }

    // Player rebuild
    current.ctx.beginPath();
    current.ctx.rect(((current.canvas.width / 2)), ((current.canvas.height / 2) - 5), 10, 10);
    current.ctx.fillStyle = "blue";
    current.ctx.fill();
    current.ctx.closePath();
  }, 20);
  }
}
