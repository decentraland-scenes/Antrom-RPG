export const DIFFICULTIES: Option[] = [
    {
      visible: true,
      available: true,
      selected: false,
      imgSources: [
        'assets/images/chooseDungeon/multiplayerEasy.png',
        'assets/images/chooseDungeon/multiplayerEasySelected.png'
      ],
      id: 'easy'
    },
    {
      visible: true,
      available: true,
      selected: false,
      imgSources: [
        'assets/images/chooseDungeon/multiplayerMedium.png',
        'assets/images/chooseDungeon/multiplayerMediumSelected.png'
      ],
      id: 'medium'
    },
    {
      visible: true,
      available: true,
      selected: false,
      imgSources: [
        'assets/images/chooseDungeon/multiplayerHard.png',
        'assets/images/chooseDungeon/multiplayerHardSelected.png'
      ],
      id: 'hard'
    },
    {
      visible: true,
      available: true,
      selected: false,
      imgSources: [
        'assets/images/chooseDungeon/multiplayerNightmare.png',
        'assets/images/chooseDungeon/multiplayerNightmareSelected.png'
      ],
      id: 'nightmare'
    }
  ]

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