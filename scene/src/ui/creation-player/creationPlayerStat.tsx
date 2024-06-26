import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { HEIGTH_FACTOR, type CharacterStatsType } from './creationPlayerData'

type creationPlayerStatProps = {
  selectedClass: CharacterStatsType | undefined
  selectedRace: CharacterStatsType | undefined
  stat: 'attack' | 'defense' | 'luck' | 'hp' | 'critRate' | 'critDamage'
  marginTop: number
}

export function CreationPlayerStat({
  selectedClass,
  selectedRace,
  stat,
  marginTop
}: creationPlayerStatProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (
    canvasInfo === null ||
    selectedClass === undefined ||
    selectedRace === undefined
  )
    return null

  let classAttack: string = ''
  let classDefense: string = ''
  let classLuck: string = ''
  let classHp: string = ''
  let classCritRate: string = ''
  let classCritDamage: string = ''
  let raceAttack: string = ''
  let raceDefense: string = ''
  let raceLuck: string = ''
  let raceHp: string = ''
  let raceCritRate: string = ''
  let raceCritDamage: string = ''

  if (selectedClass.attack !== 0) {
    classAttack = ' (+' + selectedClass.attack.toString() + ')'
  }
  if (selectedClass.defense !== 0) {
    classDefense = ' (+' + selectedClass.defense.toString() + '%)'
  }
  if (selectedClass.luck !== 0) {
    classLuck = ' (+' + selectedClass.luck.toString() + '%)'
  }
  if (selectedClass.healthPoints !== 0) {
    classHp = ' (+' + selectedClass.healthPoints.toString() + ')'
  }
  if (selectedClass.critRate !== 0) {
    classCritRate = ' (+' + selectedClass.critRate.toString() + '%)'
  }
  if (selectedClass.critDamage !== 0) {
    classCritDamage = ' (+' + selectedClass.critDamage.toString() + '%)'
  }
  if (selectedRace.attack !== 0) {
    raceAttack = selectedRace.attack.toString() + ' '
  }
  if (selectedRace.defense !== 0) {
    raceDefense = '%' + selectedRace.defense.toString() + ' '
  }
  if (selectedRace.luck !== 0) {
    raceLuck = '%' + selectedRace.luck.toString() + ' '
  }
  if (selectedRace.healthPoints !== 0) {
    raceHp = selectedRace.healthPoints.toString() + ' '
  }
  if (selectedRace.critRate !== 0) {
    raceCritRate = '%' + selectedRace.critRate.toString() + ' '
  }
  if (selectedRace.critDamage !== 0) {
    raceCritDamage = '%' + selectedRace.critDamage.toString() + ' '
  }

  let statlabel: string = ''

  switch (stat) {
    case 'attack':
      statlabel = raceAttack + classAttack
      break
    case 'defense':
      statlabel = raceDefense + classDefense
      break
    case 'hp':
      statlabel = raceHp + classHp
      break
    case 'luck':
      statlabel = raceLuck + classLuck
      break
    case 'critRate':
      statlabel = raceCritRate + classCritRate
      break
    case 'critDamage':
      statlabel = raceCritDamage + classCritDamage
      break
  }

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: canvasInfo.width * HEIGTH_FACTOR * 0.075,
        margin: { top: canvasInfo.width * HEIGTH_FACTOR * marginTop }
      }}
      uiText={{
        value: statlabel,
        fontSize: canvasInfo.width * HEIGTH_FACTOR * 0.04,
        textAlign: 'middle-center'
      }}
    />
  )
}
