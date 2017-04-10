import { Component, OnInit } from '@angular/core';
import { GameObject } from './game-object.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  keyState = {};
  title = 'Square Heroes';
  objectsArray: GameObject[] = [new GameObject()];
  canvas = null;
  ctx = null;
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

    this.gameLoop();
    this.placeObject(this.objectsArray[0]);
  }



  placeObject(gameObject: GameObject) {
    this.ctx.beginPath();
    this.ctx.rect(gameObject.xCoord, gameObject.yCoord, gameObject.xDimension, gameObject.yDimension);
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.closePath();
  }

  gameLoop() {
    var current = this;
    var gameTick = setInterval(function(){
      current.velocityVector = [0,0];
      if (current.keyState[38] || current.keyState[87]){
        current.velocityVector[1] += 1;
      }

      if (current.keyState[40] || current.keyState[83]){
        current.velocityVector[1] += -1;

      }
      if (current.keyState[37] || current.keyState[65]){
        current.velocityVector[0] += 1;

      }
      if (current.keyState[39] || current.keyState[68]){
        current.velocityVector[0] += -1;
      }
    current.objectsArray[0].move(current.velocityVector);
    current.ctx.clearRect(0, 0, current.canvas.width, current.canvas.height);
    current.placeObject(current.objectsArray[0]);

    // Player rebuild
    current.ctx.beginPath();
    current.ctx.rect(((current.canvas.width / 2) -5), ((current.canvas.height / 2) - 5), 10, 10);
    current.ctx.fillStyle = "red";
    current.ctx.fill();
    current.ctx.closePath();
    }, 30);
  }
}
