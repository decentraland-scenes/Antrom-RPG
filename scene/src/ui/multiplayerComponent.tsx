import ReactEcs , { Button, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import Canvas from '../canvas/Canvas'
import { OptionButton } from './optionButton'
import { DIFFICULTIES } from './multiplayerData'
import type { Option } from './multiplayerData'

export type SelectOptionProps = {
  id: string
  array: Option[]
}

type MultiPlayerProps ={
    isOpen: boolean
    isMenuOpen: boolean
    isCreateOpen: boolean
    isJoinOpen: boolean
    difficulty: string
    setOpen: (arg:boolean)=>void
    openCreate: (arg:boolean) =>void
    openJoin: (arg:boolean)=>void
    selectOption: ({ id, array }: SelectOptionProps) => void
    playDungeon: () => void
    menuOpen: (arg:boolean) => void
}

function Multiplayer({
    isOpen,
    isMenuOpen,
    isCreateOpen,
    isJoinOpen,
    setOpen,
    openCreate,
    openJoin,
    selectOption,
    playDungeon,
    menuOpen
    
}:MultiPlayerProps    
): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

    if (canvasInfo === null) return null

return(
    <Canvas>


        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            display: isOpen ? 'none' : 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >

         <UiEntity
                      uiBackground={{
                          textureMode: 'stretch',
                          texture:{
                              src:"assets/images/multiplayer.png"
                          }
                      }}
                      uiTransform={{
                        width: 
                          canvasInfo.width * 0.1 > 100 ? 100 : canvasInfo.width * 0.1,
                        height: 
                          canvasInfo.width * 0.1 > 100 ? 100 : canvasInfo.width * 0.1,
                        display: 'flex', 
                        positionType: 'absolute',
                        position: { top: '38%', right: 20 },
                      }}
                      onMouseDown={()=>{
                        menuOpen(true)
                        setOpen(true)
                      }}
                    >
              </UiEntity> 
      </UiEntity>
     

        <UiEntity
                uiBackground={{
                    textureMode: 'stretch',
                    texture:{
                        src:"assets/images/chooseDungeon/multiplayerStart.png"
                    }
                }}
                uiTransform={{
                  width: canvasInfo.width * 0.5,
                  height: (canvasInfo.width * 0.5) / 1.33,
                  display: isMenuOpen ? 'flex' : 'none', 
                  positionType: 'absolute',
                  position: { top: '20%', right: 200 },
                }}
              >
                    <UiEntity
                        uiTransform={{
                        position: { right: '3%', top: '23%' },
                        positionType: 'absolute',
                        width: '25',
                        height: '25'
                      }}
                      uiBackground={{
                        textureMode: 'stretch',
                        texture: { src: 'assets/images/chooseDungeon/exitButton.png' }
                      }}
                      onMouseDown={() => {
                        setOpen(false)
                        menuOpen(false)
                      }}
                      ></UiEntity>

                    <UiEntity
                          uiTransform={{
                            width: '40%',
                            height: '15%',
                            positionType: 'absolute',
                            position: { top: '50%', left: '30%' }
                          }}
                     
                          uiBackground={{
                            textureMode: 'stretch',
                            texture: { src: 'assets/images/chooseDungeon/create.png' }
                          }}
                          onMouseDown={() => {
                            setOpen(true)
                            openCreate(true)

                          }}
                      ></UiEntity>

                        <UiEntity
                          uiTransform={{
                            width: '40%',
                            height: '15%',
                            positionType: 'absolute',
                            position: { top: '70%', left: '30%' }
                          }}
                     
                          uiBackground={{
                            textureMode: 'stretch',
                            texture: { src: 'assets/images/chooseDungeon/join.png' }
                          }}
                          onMouseDown={() => {
                            setOpen(true)
                            openJoin(true)
                          }}
                      ></UiEntity>
          </UiEntity>
           
        
          <UiEntity
            uiBackground={{
              textureMode: 'stretch',
              texture:{src:'assets/images/chooseDungeon/multiplayerCreate.png'}
            }}
            uiTransform={{
              width: canvasInfo.width * 0.5,
              height: (canvasInfo.width * 0.5) / 1.33,
              display: isCreateOpen ? 'flex' : 'none', 
              positionType: 'absolute',
              position: { top: '20%', right: 200 },
            }}
                          
          >

          <UiEntity
                uiTransform={{
                  positionType: 'absolute',
                  position: { top: '40%', right: '15%' },
                  width: '75%',
                  height: '45%',
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'nowrap',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                  {DIFFICULTIES.map((difficulty, index) => (
                    <UiEntity
                      key={index}
                      uiTransform={{ width: '40%', height: '70%', margin: '1%' }}
                    >
                        <OptionButton
                          array={DIFFICULTIES}
                          visible={difficulty.visible}
                          available={difficulty.available}
                          selected={difficulty.selected}
                          imgSources={difficulty.imgSources}
                          id={difficulty.id}
                          selectOption={selectOption}
                        />
                    </UiEntity>
                ))} 
                
              </UiEntity>      
          <Button
                value=""
                variant="secondary"
                uiBackground={{
                  textureMode:  'stretch',
                  texture: {src: "assets/images/chooseDungeon/multiplayerPlay.png"}
                }}

                uiTransform={{
                  position: {top: "85%", left: "8%"},
                  positionType: 'absolute',
                  display: 'flex',
                  width: "40%",
                  height: "12%"
                }}

                onMouseDown={()=>{
                  setOpen(true)
                  menuOpen(false)
                 // playDungeon
                   
                  }
                }
            />   
  
            <UiEntity
                uiBackground={{
                  textureMode:  'stretch',
                  texture: {src: "assets/images/chooseDungeon/multiplayerBack.png"}
                }}

                uiTransform={{
                  position: {top: "85%", left: "52%"},
                  positionType: 'absolute',
                  display: 'flex',
                  width: "40%",
                  height: "12%"
                }}

                onMouseDown={()=>{
                    openCreate(false)
                    menuOpen(true)
                  }
                }
            >   
            </UiEntity>
            <UiEntity
                  uiTransform={{
                  position: { right: '3%', top: '23%' },
                  positionType: 'absolute',
                  width: '25',
                  height: '25'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  texture: { src: 'assets/images/chooseDungeon/exitButton.png' }
                }}
                onMouseDown={() => {
                  setOpen(false)
                  menuOpen(false)

                }}
              ></UiEntity>
      </UiEntity>

      <UiEntity
            uiBackground={{
              textureMode: 'stretch',
              texture:{src:'assets/images/chooseDungeon/multiplayerLobbies.png'}
            }}
            uiTransform={{
              width: canvasInfo.width * 0.5,
              height: (canvasInfo.width * 0.5) / 1.33,
              display: isJoinOpen ? 'flex' : 'none', 
              positionType: 'absolute',
              position: { top: '20%', right: 200 },
            }}
                          
          >
              <UiEntity
                uiBackground={{
                  textureMode:  'stretch',
                  texture: {src: "assets/images/chooseDungeon/multiplayerPlay.png"}
                }}

                uiTransform={{
                  position: {top: "85%", left: "8%"},
                  positionType: 'absolute',
                  display: 'flex',
                  width: "40%",
                  height: "12%"
                }}

                onMouseDown={playDungeon}
                
            >   
            
            </UiEntity>
            <UiEntity
                uiBackground={{
                  textureMode:  'stretch',
                  texture: {src: "assets/images/chooseDungeon/multiplayerBack.png"}
                }}

                uiTransform={{
                  position: {top: "85%", left: "52%"},
                  positionType: 'absolute',
                  display: 'flex',
                  width: "40%",
                  height: "12%"
                }}

                onMouseDown={()=>{
                    openJoin(false)
                    menuOpen(true)
                  }
                }
            >   
            </UiEntity>
            <UiEntity
                  uiTransform={{
                  position: { right: '3%', top: '23%' },
                  positionType: 'absolute',
                  width: '25',
                  height: '25'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  texture: { src: 'assets/images/chooseDungeon/exitButton.png' }
                }}
                onMouseDown={() => {
                  setOpen(false)
                  menuOpen(false)
                }}
              ></UiEntity>

        </UiEntity>
   
    </Canvas>
    )
}
 export default Multiplayer


