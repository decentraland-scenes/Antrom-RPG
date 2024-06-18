export class UICounter {
  public credits: number
  constructor() {
    this.credits = 0
  }

  set(number: number) {
    this.credits = number
  }

  increase(number: number) {
    this.credits = this.credits + number
  }

  decrease(number: number) {
    if (this.credits > 0) {
      this.credits = this.credits - number
    }
  }

  read() {
    return this.credits
  }
}
