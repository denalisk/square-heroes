import { UserItem } from './player.model';

export class GameObject {
  public xDimension: number = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(5)) + Math.ceil(10));
  public yDimension: number = this.xDimension;
  public yCoord: number = Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(-1000)) + Math.ceil(-1000));
  public xCoord: number = Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(-1000)) + Math.ceil(-1000));
  public color: string = 'red';
  public shape: string = 'square';
  public collidable: boolean = true;

  constructor(public type: string) {};

  move(vector: number[]) {
    this.xCoord += vector[0];
    this.yCoord += vector[1];
  }

  setProperties(xCoord: number, yCoord: number, xDimension: number, yDimension: number, color: string) {
    this.yCoord = yCoord;
    this.xCoord = xCoord;
    this.xDimension = xDimension;
    this.yDimension = yDimension;
    this.color = color;
  }
}

export class Enemy extends GameObject {
  public health: number = Math.floor(Math.random() * (Math.floor(100) - Math.ceil(200)) + Math.ceil(100));
  public attacking: boolean = false;
  rollForDamage() {
    return Math.floor(Math.random() * (Math.floor(this.xDimension) - Math.ceil(1)) + Math.ceil(this.xDimension))
  }
}

export class Boss extends Enemy {

}

export class Village extends GameObject {
  public collidable: boolean = false;
  public villagers: number = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(5)) + Math.ceil(10));
  public buildings: number = Math.floor(Math.random() * (Math.floor(15) - Math.ceil(10)) + Math.ceil(15));
}



export class Building extends GameObject {
  public color: string = "#234466"
  public xCoord: number = (Math.floor(Math.random() * (Math.floor(this.village.xCoord + this.village.xDimension) - Math.ceil(this.village.xCoord)) + Math.ceil(this.village.xCoord + this.village.xDimension))) - this.village.xDimension;
  public yCoord: number = (Math.floor(Math.random() * (Math.floor(this.village.yCoord + this.village.yDimension) - Math.ceil(this.village.yCoord)) + Math.ceil(this.village.yCoord + this.village.yDimension))) - this.village.yDimension;
  constructor(public type: string, public village: Village) {
    super(type);
  }
}

export class Item extends GameObject {
  public name: string;
  public category: string;
  public userItem: UserItem;

  constructor(public type: string) {

  super(type)
  this.collidable = false;
  }
}
