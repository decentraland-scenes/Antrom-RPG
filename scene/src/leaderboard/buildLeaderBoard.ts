import {
  Font,
  type Entity,
  engine,
  Transform,
  TextShape,
  TextAlignMode,
  Rotate
} from '@dcl/sdk/ecs'
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

const TiltleFont = Font.F_SERIF
const SFFont = Font.F_SERIF

export enum TextTypes {
  BIGTITLE = 'bigtitle',
  BIGVALUE = 'bigvalue',
  TITLE = 'title',
  LABEL = 'label',
  VALUE = 'value',
  UNIT = 'unit',
  TINYVALUE = 'tinyvalue',
  TINYTITLE = 'tinytitle'
}

export class ScoreBoardText {
  public entity: Entity
  constructor(
    type: TextTypes,
    text: string,
    position: Vector3,
    parent: Entity
  ) {
    this.entity = engine.addEntity()
    Transform.createOrReplace(this.entity, { parent })
    Transform.getMutable(this.entity).position = position
    TextShape.createOrReplace(this.entity, { text, width: 10 })
    switch (type) {
      case TextTypes.BIGTITLE:
        TextShape.getMutable(this.entity).fontSize = 4
        TextShape.getMutable(this.entity).textColor = Color4.White()
        TextShape.getMutable(this.entity).textAlign =
          TextAlignMode.TAM_MIDDLE_CENTER
        TextShape.getMutable(this.entity).font = TiltleFont
        break
      case TextTypes.BIGVALUE:
        TextShape.getMutable(this.entity).fontSize = 3
        TextShape.getMutable(this.entity).textColor = Color4.Green()
        TextShape.getMutable(this.entity).textAlign =
          TextAlignMode.TAM_MIDDLE_CENTER
        TextShape.getMutable(this.entity).font = TiltleFont
        break

      case TextTypes.TITLE:
        TextShape.getMutable(this.entity).fontSize = 3
        TextShape.getMutable(this.entity).textColor = Color4.White()
        TextShape.getMutable(this.entity).textAlign =
          TextAlignMode.TAM_MIDDLE_CENTER
        TextShape.getMutable(this.entity).width = 10
        TextShape.getMutable(this.entity).font = TiltleFont
        break
      case TextTypes.TINYTITLE:
        TextShape.getMutable(this.entity).fontSize = 2
        TextShape.getMutable(this.entity).textColor = Color4.White()
        TextShape.getMutable(this.entity).textAlign =
          TextAlignMode.TAM_MIDDLE_CENTER
        TextShape.getMutable(this.entity).width = 10
        TextShape.getMutable(this.entity).font = SFFont
        break
      case TextTypes.LABEL:
        TextShape.getMutable(this.entity).fontSize = 3
        TextShape.getMutable(this.entity).textColor = Color4.White()
        TextShape.getMutable(this.entity).textAlign = TextAlignMode.TAM_TOP_LEFT
        TextShape.getMutable(this.entity).font = SFFont
        break
      case TextTypes.VALUE:
        TextShape.getMutable(this.entity).fontSize = 3
        TextShape.getMutable(this.entity).textColor = Color4.Green()
        TextShape.getMutable(this.entity).textAlign =
          TextAlignMode.TAM_TOP_RIGHT
        TextShape.getMutable(this.entity).font = SFFont
        break
      case TextTypes.TINYVALUE:
        TextShape.getMutable(this.entity).fontSize = 2
        TextShape.getMutable(this.entity).textColor = Color4.Green()
        TextShape.getMutable(this.entity).textAlign =
          TextAlignMode.TAM_TOP_RIGHT
        TextShape.getMutable(this.entity).font = SFFont
        break

      case TextTypes.UNIT:
        TextShape.getMutable(this.entity).fontSize = 2
        TextShape.getMutable(this.entity).textColor = Color4.White()
        TextShape.getMutable(this.entity).textAlign =
          TextAlignMode.TAM_TOP_RIGHT
        TextShape.getMutable(this.entity).font = SFFont
        break
    }
    console.log('create scorboard text')
  }
}

const scoreBoardNames: ScoreBoardText[] = []
const scoreBoardValues: ScoreBoardText[] = []

export async function buildLeaderBoard(
  scoreData: any[],
  parent: Entity,
  length: number
) {
  // if canvas is empty
  if (scoreBoardNames.length === 0) {
    const nameTitle = new ScoreBoardText(
      TextTypes.BIGTITLE,
      '   Callan Quest',
      Vector3.create(-0.4, 0.65, 0),
      parent
    )

    const scoreTitle = new ScoreBoardText(
      TextTypes.BIGTITLE,
      '',
      Vector3.create(0.8, 0.65, 0),
      parent
    )

    for (let i = 0; i < length; i++) {
      if (i < scoreData.length) {
        const username = new ScoreBoardText(
          TextTypes.TINYTITLE,
          scoreData[i].username,
          Vector3.create(-0.6, 0.2 - i / 4, 0),
          parent
        )
        scoreBoardNames.push(username)

        const dungeons_completed = new ScoreBoardText(
          TextTypes.TINYVALUE,
          scoreData[i].dungeons_completed.toString(),
          Vector3.create(0.6, 0.2 - i / 4, 0),
          parent
        )
        scoreBoardValues.push(dungeons_completed)
      } else {
        // create empty line

        const name = new ScoreBoardText(
          TextTypes.TINYTITLE,
          '-',
          Vector3.create(-0.6, 0.2 - i / 4, 0),
          parent
        )
        scoreBoardNames.push(name)

        const score = new ScoreBoardText(
          TextTypes.TINYVALUE,
          '-',
          Vector3.create(0.6, 0.2 - i / 4, 0),
          parent
        )
        scoreBoardValues.push(score)
        console.log('empty line')
      }
    }
  } else {
    // update existing board
    for (let i = 0; i < length; i++) {
      if (i > scoreData.length) continue
      TextShape.getMutable(scoreBoardNames[i].entity).text =
        scoreData[i].username
      TextShape.getMutable(scoreBoardNames[i].entity).text =
        scoreData[i].username
    }
  }
}
