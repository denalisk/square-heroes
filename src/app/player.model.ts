export class Player {
  public yDimension: number = 10;
  public xDimension: number = 10;
  public direction: string = "south";
  public xAttack = 0;
  public yAttack = 0;
  //EXPERIENCE & LEVEL
  public experience = 0;
  public level = 1;
  public skillPoints = 0;
  //STATS
  public strengthLvl = 1;
  public attackLvl = 1;
  public defenseLvl = 1;
  public health = 50;
  public damageModifier = (this.strengthLvl * 2);
  //GEAR
  public mainHand: string = "bear knuckles";
  public offHand: string = "bear knuckles";
  public headGear: string = "cap";
  public chestPiece: string = "tabard";
  public legPiece: string = "kilt";

  getXAttack() {
    if(this.direction === "west") {
      this.xAttack = -1 * this.xDimension;
    } else if(this.direction === "east") {
      this.xAttack = 1 * this.xDimension;
    } else {
      this.xAttack = 0;
    }
  }

  getYAttack() {
    if(this.direction === "south") {
      this.yAttack =  1 * this.yDimension;
    } else if(this.direction === "north") {
      this.yAttack =  -1 * this.yDimension;
    } else {
      this.yAttack = 0;
    }
  }
}
