export class UICounter {
  public credits: number
  constructor() {
    this.credits = 0
  }

  set(number: number):void {
    this.credits = number
  }

  increase(number: number):void  {
    this.credits = this.credits + number
  }

  decrease(number: number):void  {
    if (this.credits > 0) {
      this.credits = this.credits - number
    }
  }

  read():number {
    return this.credits
  }
}
