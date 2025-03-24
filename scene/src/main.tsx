import { GeneralDisruptiveBlow } from './player/skills/definitions'
import { GeneralFirstAidKit } from './player/skills/definitions'
import { GeneralFireball } from './player/skills/definitions'
import { GeneralStorm } from './player/skills/definitions'
import { GeneralLuckyCharm } from './player/skills/definitions'
import { CLASS_MAIN_SKILL } from './player/skills/classes-main-skill'
import { Player } from './player/player'

// Initialize player skills
const myPlayer = Player.getInstance()
myPlayer.setSkill(0, CLASS_MAIN_SKILL[myPlayer.class]())
myPlayer.setSkill(1, new GeneralDisruptiveBlow())
myPlayer.setSkill(2, new GeneralFirstAidKit())
myPlayer.setSkill(3, new GeneralFireball())
myPlayer.setSkill(4, new GeneralStorm())
myPlayer.setSkill(5, new GeneralLuckyCharm()) 