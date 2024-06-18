export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function getRandomIntRange(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
