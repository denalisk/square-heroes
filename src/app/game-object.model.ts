export class GameObject {
  public xDimension: number = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(5)) + Math.ceil(10));
  public yDimension: number = this.xDimension;
  public yCoord: number = Math.floor(Math.random() * (Math.floor(500) - Math.ceil(-500)) + Math.ceil(-500));
  public xCoord: number = Math.floor(Math.random() * (Math.floor(500) - Math.ceil(-500)) + Math.ceil(-500));
  public color: string = 'black';
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

export class Village extends GameObject {
  public collidable: boolean = false;
  public villagers: number = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(5)) + Math.ceil(10));;
  public buildings: number = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(5)) + Math.ceil(10));;
}

export class Item extends GameObject {
  public name: string;
  public category: string;
  constructor(public type: string) {
  super(type)
}
}
