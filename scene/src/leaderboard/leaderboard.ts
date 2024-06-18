import {
  Font,
  type Entity,
  engine,
  Transform,
  TextShape,
  TextAlignMode
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'

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

export class LeaderBoard {
  private readonly scoreBoardNames: Entity[] = []
  private readonly scoreBoardValues: Entity[] = []
  public readonly leaderBoard: Entity
  private readonly nameTitle: Entity
  private readonly scoreTitle: Entity

  constructor() {
    console.log('leaderboard created')
    this.leaderBoard = engine.addEntity()
    Transform.createOrReplace(this.leaderBoard, { position: Vector3.create(0, 0, 0) })

    this.nameTitle = this.createScoreBoardText(
      TextTypes.BIGTITLE,
      '   Callan Quest',
      Vector3.create(-0.4, 0.65, 0),
      this.leaderBoard
    )
    this.scoreTitle = this.createScoreBoardText(
      TextTypes.BIGTITLE,
      '',
      Vector3.create(0.8, 0.65, 0),
      this.leaderBoard
    )
  }

  private createScoreBoardText(
    type: TextTypes,
    text: string,
    position: Vector3,
    parent: Entity
  ): Entity {
    const entity = engine.addEntity()
    Transform.createOrReplace(entity, { parent })
    Transform.getMutable(entity).position = position
    TextShape.createOrReplace(entity, { text, width: 10 })

    const textShape = TextShape.getMutable(entity)
    switch (type) {
      case TextTypes.BIGTITLE:
        textShape.fontSize = 4
        textShape.textColor = Color4.White()
        textShape.textAlign = TextAlignMode.TAM_MIDDLE_CENTER
        textShape.font = TiltleFont
        break
      case TextTypes.BIGVALUE:
        textShape.fontSize = 3
        textShape.textColor = Color4.Green()
        textShape.textAlign = TextAlignMode.TAM_MIDDLE_CENTER
        textShape.font = TiltleFont
        break
      case TextTypes.TITLE:
        textShape.fontSize = 3
        textShape.textColor = Color4.White()
        textShape.textAlign = TextAlignMode.TAM_MIDDLE_CENTER
        textShape.width = 10
        textShape.font = TiltleFont
        break
      case TextTypes.TINYTITLE:
        textShape.fontSize = 2
        textShape.textColor = Color4.White()
        textShape.textAlign = TextAlignMode.TAM_MIDDLE_CENTER
        textShape.width = 10
        textShape.font = SFFont
        break
      case TextTypes.LABEL:
        textShape.fontSize = 3
        textShape.textColor = Color4.White()
        textShape.textAlign = TextAlignMode.TAM_TOP_LEFT
        textShape.font = SFFont
        break
      case TextTypes.VALUE:
        textShape.fontSize = 3
        textShape.textColor = Color4.Green()
        textShape.textAlign = TextAlignMode.TAM_TOP_RIGHT
        textShape.font = SFFont
        break
      case TextTypes.TINYVALUE:
        textShape.fontSize = 2
        textShape.textColor = Color4.Green()
        textShape.textAlign = TextAlignMode.TAM_TOP_RIGHT
        textShape.font = SFFont
        break
      case TextTypes.UNIT:
        textShape.fontSize = 2
        textShape.textColor = Color4.White()
        textShape.textAlign = TextAlignMode.TAM_TOP_RIGHT
        textShape.font = SFFont
        break
    }
    return entity
  }

  async buildLeaderBoard(
    scoreData: any[],
    parent: Entity,
    length: number
  ): Promise<void> {
    if (this.scoreBoardNames.length === 0) {
      Transform.getMutable(this.leaderBoard).parent = parent
      for (let i = 0; i < length; i++) {
        if (i < scoreData.length) {
          const username = this.createScoreBoardText(
            TextTypes.TINYTITLE,
            scoreData[i].username,
            Vector3.create(-0.6, 0.2 - i / 4, 0),
            this.leaderBoard
          )
          this.scoreBoardNames.push(username)

          const dungeonsCompleted = this.createScoreBoardText(
            TextTypes.TINYVALUE,
            scoreData[i].dungeons_completed.toString(),
            Vector3.create(0.6, 0.2 - i / 4, 0),
            this.leaderBoard
          )
          this.scoreBoardValues.push(dungeonsCompleted)
        } else {
          // create empty line
          const name = this.createScoreBoardText(
            TextTypes.TINYTITLE,
            '-',
            Vector3.create(-0.6, 0.2 - i / 4, 0),
            this.leaderBoard
          )
          this.scoreBoardNames.push(name)

          const score = this.createScoreBoardText(
            TextTypes.TINYVALUE,
            '-',
            Vector3.create(0.6, 0.2 - i / 4, 0),
            this.leaderBoard
          )
          this.scoreBoardValues.push(score)
          console.log('empty line')
        }
      }
    } else {
      // update existing board
      for (let i = 0; i < length; i++) {
        if (i >= scoreData.length) continue
        TextShape.getMutable(this.scoreBoardNames[i]).text = scoreData[i].username
        TextShape.getMutable(this.scoreBoardValues[i]).text = scoreData[i].dungeons_completed.toString()
      }
    }
  }

  public destroy():void {
    engine.removeEntity(this.nameTitle)
    engine.removeEntity(this.scoreTitle)
    for (const entity of this.scoreBoardNames) {
      engine.removeEntity(entity)
    }
    for (const entity of this.scoreBoardValues) {
      engine.removeEntity(entity)
    }
    engine.removeEntity(this.leaderBoard)
  }
}
