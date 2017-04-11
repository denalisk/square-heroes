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
  objectsArray: GameObject[] = [new GameObject('object')];
  velocityVector: number[] = [0,0];

  player = new GameObject('player');


  canvas = null;
  ctx = null;

  ngOnInit() {
    this.objectsArray[0].setProperties(0, 0, 40, 40, 'black');
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    window.addEventListener('keydown',(e) => {
        this.keyState[e.keyCode || e.which] = true;
    },true);
    window.addEventListener('keyup', (e) => {
        this.keyState[e.keyCode || e.which] = false;
    },true);

// CREATE PLAYER PROPERTIES
    this.player.yDimension = 10;
    this.player.xDimension = 10;
    this.player.xCoord = (this.canvas.width / 2) - this.player.xDimension/2;
    this.player.yCoord = (this.canvas.height / 2) -this.player.yDimension/2;
    this.player.color = "red";
// FINISH PLAYER PROPERTIES

    this.gameLoop();
  }


  placeObject(gameObject: GameObject) {
    this.ctx.beginPath();
    this.ctx.rect(gameObject.xCoord, gameObject.yCoord, gameObject.xDimension, gameObject.yDimension);
    this.ctx.fillStyle = gameObject.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  checkCollisions() {
    let current = this;
    for (let item of this.objectsArray) {
      if(current.checkCollide(item)) {
            console.log("BAM");
            let checkItem = new GameObject('object');
            let holdVector: number[] = [current.velocityVector[0], current.velocityVector[1]];
            checkItem.setProperties(item.xCoord, item.yCoord, item.xDimension, item.yDimension, item.color);
            checkItem.move([-5 * holdVector[0],0]);
            if (!(current.checkCollide(checkItem))) {
              console.log("collision on x-axis");
              current.velocityVector[0] = 0;
            }
            checkItem.move([holdVector[0], -holdVector[1]]);
            if (!(current.checkCollide(checkItem))) {
              console.log("collision on y-axis");
              current.velocityVector[1] = 0;
            }
          }
    }
  }

  checkCollide(item: GameObject) {
    var current = this;
    if (item.xCoord < current.player.xCoord + current.player.xDimension &&
        item.xCoord + item.xDimension > current.player.xCoord &&
        item.yCoord < current.player.yCoord + current.player.yDimension &&
        item.yDimension + item.yCoord > current.player.yCoord) {
          console.log("collide true");
          return true;
    } else {
          return false;
    }
  }

  gameLoop() {
    var current = this;
    var attacking: boolean = false;
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

      for(let gameObject of current.objectsArray) {
        gameObject.move(current.velocityVector)
      }

    current.checkCollisions();
    current.objectsArray[0].move(current.velocityVector);
    current.ctx.clearRect(0, 0, current.canvas.width, current.canvas.height);

    for(let object of current.objectsArray){
      current.placeObject(object);
    }

    // Player rebuild
    current.ctx.beginPath();
    current.placeObject(current.player);
    current.ctx.fillStyle = "red";
    current.ctx.fill();
    current.ctx.closePath();
  }, 20);
  }
}
