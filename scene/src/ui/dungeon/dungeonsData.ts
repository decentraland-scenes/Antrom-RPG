export const DUNGEONS: Option[] = [
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/dungeon1Avail.png',
      'assets/images/chooseDungeon/dungeon1Unavail.png'
    ],
    id: 'dungeon1'
  },
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/dungeon2Avail.png',
      'assets/images/chooseDungeon/dungeon2Unavail.png'
    ],
    id: 'dungeon2'
  },
  {
    visible: true,
    available: false,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/dungeon3Avail.png',
      'assets/images/chooseDungeon/dungeon3Unavail.png'
    ],
    id: 'dungeon3'
  },
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/dungeon4Avail.png',
      'assets/images/chooseDungeon/dungeon4Unavail.png'
    ],
    id: 'dungeon4'
  },
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/dungeon5Avail.png',
      'assets/images/chooseDungeon/dungeon5Unavail.png'
    ],
    id: 'dungeon5'
  },
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/dungeon6Avail.png',
      'assets/images/chooseDungeon/dungeon6Unavail.png'
    ],
    id: 'dungeon6'
  },
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/dungeon7Avail.png',
      'assets/images/chooseDungeon/dungeon7Unavail.png'
    ],
    id: 'dungeon7'
  }
]

export const DIFFICULTIES: Option[] = [
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/easy.png',
      'assets/images/chooseDungeon/easyUnavail.png'
    ],
    id: 'easy'
  },
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/medium.png',
      'assets/images/chooseDungeon/mediumUnavail.png'
    ],
    id: 'medium'
  },
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/hard.png',
      'assets/images/chooseDungeon/hardUnavail.png'
    ],
    id: 'hard'
  },
  {
    visible: true,
    available: true,
    selected: false,
    imgSources: [
      'assets/images/chooseDungeon/nightmare.png',
      'assets/images/chooseDungeon/nightmareUnavail.png'
    ],
    id: 'nightmare'
  }
]

export const DUNGEONS_TO_SHOW = 3

export type Option = {
  visible: boolean
  available: boolean
  selected: boolean
  imgSources: string[]
  id: string
}

export type OptionWithArray = Option & {
  array: Option[]
}

export const DAILY_FREE_TOKENS: number = 6
export const PREMIUM_TOKENS: number = 0
export const SEASON_PASS: number = 0
