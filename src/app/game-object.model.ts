export class GameObject {
  public xDimension: number = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(5)) + Math.ceil(10));
  public yDimension: number = this.xDimension;
  public yCoord: number = Math.floor(Math.random() * (Math.floor(500) - Math.ceil(-500)) + Math.ceil(-500));
  public xCoord: number = Math.floor(Math.random() * (Math.floor(500) - Math.ceil(-500)) + Math.ceil(-500));
  public color: string = "black";
  public direction: string;

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
