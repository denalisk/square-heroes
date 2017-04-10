export class GameObject {
  public xDimension: number = 50;
  public yDimension: number = 50;
  public yCoord: number = -10;
  public xCoord: number = -10;
  public color: string = "black";
  constructor() {};

  move(vector: number[]) {
    this.xCoord += vector[0];
    this.yCoord += vector[1];
  }
}
