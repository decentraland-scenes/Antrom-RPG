import { GeneralDisruptiveBlow } from './player/skills/definitions'
import { GeneralFirstAidKit } from './player/skills/definitions'
import { GeneralFireball } from './player/skills/definitions'
import { GeneralStorm } from './player/skills/definitions'
import { GeneralLuckyCharm } from './player/skills/definitions'
import { CLASS_MAIN_SKILL } from './player/skills/classes-main-skill'
import { Player } from './player/player'
import * as utils from '@dcl-sdk/utils'

// Initialize player skills
const myPlayer = Player.getInstance()
myPlayer.setSkill(0, CLASS_MAIN_SKILL[myPlayer.class]())
myPlayer.setSkill(1, new GeneralDisruptiveBlow())
myPlayer.setSkill(2, new GeneralFirstAidKit())
myPlayer.setSkill(3, new GeneralFireball())
myPlayer.setSkill(4, new GeneralStorm())
myPlayer.setSkill(5, new GeneralLuckyCharm())

// Test red flash after 3 seconds
utils.timers.setTimeout(() => {
  console.log('Testing red flash...')
  myPlayer.damaged = true
  console.log('Player damaged set to:', myPlayer.damaged)
  utils.timers.setTimeout(() => {
    console.log('Hiding red flash...')
    myPlayer.damaged = false
    console.log('Player damaged set to:', myPlayer.damaged)
  }, 2000)
}, 3000) 