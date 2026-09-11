import './archive.css'
import { Canvas, useThree } from '@react-three/fiber'
import AmethystLibraryRoom
  from './AmethystLibraryRoom'
import SchoolRoom from './SchoolRoom'
import ThroneRoom from './ThroneRoom'
import {
  OrbitControls,
  useGLTF,
  Html
} from '@react-three/drei'
import {
  useEffect,
  useRef,
  useState
} from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

const PROJECTS = [
  {
    id: 1,
    name: 'OnlyStudents',
    subtitle: 'Campus Super App',
    image: '/images/onlystudents-project.png',
    description:
      'A campus-focused platform built to connect university students, opportunities, services, and campus life.',
    technologies: ['React Native', 'Expo', 'Supabase'],
    liveUrl: 'https://www.onlystudents.co.in/',
    githubUrl: 'https://github.com/SagarChhetrii'
  },
  {
    id: 2,
    name: 'LEARNING TRACKER',
    subtitle: 'Personal Learning Dashboard',
    image: '/images/learning-tracker-project.png',
    description:
      'A personal learning platform designed to organize courses, track progress, manage learning goals, and keep the entire learning journey in one place.',
    technologies: [
      'React',
      'Vite',
      'Tailwind CSS',
    ],
    liveUrl:
      'https://learn-trackhub.vercel.app/',
    githubUrl:
      'https://github.com/SagarChhetrii',
  },
  {
    id: 3,
    name: 'APPROVALVAULT',
    subtitle: 'Secure Client Approval Platform',
    image: '/images/approval-vault-project.png',
    description:
      'A secure client approval platform for uploading, reviewing, approving, and verifying files with version control, audit trails, and approval certificates.',
    technologies: [
      'React',
      'Vite',
      'Node.js',
      'Express',
      'MongoDB',
      'JWT',
    ],
    liveUrl:
      'https://github.com/SagarChhetrii/approval-vault',
    githubUrl:
      'https://github.com/SagarChhetrii/approval-vault',
  },
]

function LibraryRoom({
  onReady,
  onProjectHover,
  onProjectSelect
}) {

  const [
    hoveredProject,
    setHoveredProject
  ] = useState(null)

  const { scene } =
    useGLTF('/models/library.glb')

  const { camera } = useThree()

  const controlsRef = useRef()

  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia(
      '(max-width: 768px)'
    ).matches

  useEffect(() => {

    scene.position.set(
      0,
      0,
      0
    )

    scene.updateWorldMatrix(
      true,
      true
    )

    const box =
      new THREE.Box3()
        .setFromObject(scene)

    const center =
      new THREE.Vector3()

    const size =
      new THREE.Vector3()

    box.getCenter(center)

    box.getSize(size)

    console.log(
      '📚 LIBRARY CENTER:',
      center
    )

    console.log(
      '📚 LIBRARY SIZE:',
      size
    )

    scene.position.x -=
      center.x

    scene.position.y -=
      center.y

    scene.position.z -=
      center.z

    // Mobile: zoom OUT more (larger distance)
    const startDistance = isMobile ? 850 : 700

    camera.position.set(
      0,
      80,
      startDistance
    )

    const interiorTarget =
      new THREE.Vector3(
        0,
        50,
        0
      )

    camera.lookAt(
      interiorTarget
    )

    camera.near = 0.5

    camera.far =
      Math.max(
        size.x,
        size.y,
        size.z
      ) * 50

    camera.updateProjectionMatrix()

    scene.traverse(
      (object) => {

        if (!object.isMesh)
          return

        if (object.material) {

          object.material.side =
            THREE.DoubleSide

        }

        object.raycast =
          () => {}

      }
    )

    if (controlsRef.current) {

      controlsRef.current.target.copy(
        interiorTarget
      )

      controlsRef.current.enableRotate =
        true

      controlsRef.current.enablePan =
        false

      controlsRef.current.enableZoom =
        true

      controlsRef.current.minPolarAngle =
        1.53

      controlsRef.current.maxPolarAngle =
        1.53

      controlsRef.current.minAzimuthAngle =
        -0.65

      controlsRef.current.maxAzimuthAngle =
        0.65

      controlsRef.current.maxDistance =
        startDistance

      controlsRef.current.minDistance =
        280

      controlsRef.current.zoomSpeed =
        0.35

      controlsRef.current.update()

    }

    const timer =
      setTimeout(() => {

        onReady()

      }, 300)

    return () =>
      clearTimeout(timer)

  }, [
    scene,
    camera,
    onReady
  ])


  const handleProjectHover =
    (projectNumber) => {

      setHoveredProject(
        projectNumber
      )

    }


  const handleProjectOut =
    () => {

      setHoveredProject(
        null
      )

    }


  const ProjectLabel = ({
    number,
    name,
    position
  }) => {

    if (
      hoveredProject !== number
    ) {
      return null
    }

    const isTouchDevice =
      typeof window !== 'undefined' &&
      window.matchMedia(
        '(pointer: coarse)'
      ).matches

    return (

      <Html
        fullscreen
        zIndexRange={[
          10000,
          10000
        ]}
        style={{
          pointerEvents:
            'none',
        }}
      >

        <div
          style={{
            position: 'fixed',

            top:
              isTouchDevice
                ? '20%'
                : '38%',

            left: '50%',

            transform:
              'translate(-50%, -50%)',

            display: 'flex',

            flexDirection:
              'column',

            alignItems:
              'center',

            color:
              '#FFFFFF',

            fontFamily:
              'Arial, Helvetica, sans-serif',

            userSelect:
              'none',

            pointerEvents:
              'none',

            maxWidth:
              'calc(100vw - 32px)',

            textAlign:
              'center',
          }}
        >

          <div
            style={{
              display: 'flex',

              alignItems:
                'center',

              justifyContent:
                'center',

              gap:
                isTouchDevice
                  ? '8px'
                  : '10px',

              padding:
                isTouchDevice
                  ? '9px 13px'
                  : '8px 14px',

              background:
                'rgba(0, 0, 0, 0.78)',

              border:
                '1px solid rgba(168, 85, 247, 0.7)',

              borderRadius:
                '5px',

              boxShadow:
                '0 0 15px rgba(168, 85, 247, 0.35)',

              backdropFilter:
                'blur(5px)',
            }}
          >

            <span
              style={{
                padding:
                  isTouchDevice
                    ? '4px 8px'
                    : '3px 8px',

                border:
                  '1px solid rgba(255,255,255,0.7)',

                borderRadius:
                  '3px',

                fontSize:
                  isTouchDevice
                    ? '11px'
                    : '13px',

                fontWeight:
                  '700',

                letterSpacing:
                  '1px',

                background:
                  'rgba(255,255,255,0.08)',
              }}
            >

              {isTouchDevice
                ? 'TAP'
                : 'E'}

            </span>


            <span
              style={{
                fontSize:
                  isTouchDevice
                    ? '11px'
                    : '13px',

                letterSpacing:
                  isTouchDevice
                    ? '2px'
                    : '3px',

                fontWeight:
                  '500',
              }}
            >

              {isTouchDevice
                ? 'TO OPEN'
                : 'INSPECT'}

            </span>

          </div>

        </div>

      </Html>

    )

  }


  useEffect(() => {

    document.body.style.cursor =
      hoveredProject
        ? 'pointer'
        : 'default'

    return () => {

      document.body.style.cursor =
        'default'

    }

  }, [
    hoveredProject
  ])


  const projectLamps = [

    {
      number: 1,
      name: 'ONLYSTUDENTS',
      position: [
        -60,
        5,
        -250
      ],
      logName:
        'PROJECT 1'
    },

    {
      number: 2,
      name: 'PROJECT 2',
      position: [
        -200,
        25,
        -250
      ],
      labelPosition: [
        -200,
        90,
        -250
      ],
      logName:
        'PROJECT 2'
    },

    {
      number: 3,
      name: 'PROJECT 3',
      position: [
        110,
        -45,
        -250
      ],
      labelPosition: [
        110,
        40,
        -250
      ],
      logName:
        'PROJECT 3'
    }

  ]


  return (

    <>

      <primitive
        object={scene}
        scale={1}
      />


      <mesh
        position={[
          0,
          360,
          0
        ]}
        rotation={[
          Math.PI / 2,
          0,
          0
        ]}
        raycast={() => null}
      >

        <planeGeometry
          args={[
            1800,
            1800
          ]}
        />

        <meshBasicMaterial
          color="#050509"
          side={
            THREE.DoubleSide
          }
          depthWrite={
            false
          }
        />

      </mesh>


      {projectLamps.map(
        (projectLamp) => (

          <group
            key={
              projectLamp.number
            }
          >

            <mesh
              position={
                projectLamp.position
              }

              scale={
                hoveredProject ===
                projectLamp.number
                  ? 1.1
                  : 1
              }

              onPointerOver={
                (event) => {

                  event.stopPropagation()

                  console.log(
                    '🔥🔥 HOVER DETECTED:',
                    projectLamp.number
                  )

                  setHoveredProject(
                    projectLamp.number
                  )

                  onProjectHover(
                    projectLamp.number
                  )

                }
              }

              onPointerOut={
                (event) => {

                  event.stopPropagation()

                  handleProjectOut()

                  onProjectHover(
                    null
                  )

                }
              }

              onClick={
                (event) => {

                  event.stopPropagation()

                  if (
                    event.pointerType ===
                    'touch'
                  ) {

                    onProjectSelect(
                      projectLamp.number
                    )

                  }

                }
              }

              onDoubleClick={
                (event) => {

                  event.stopPropagation()

                  console.log(
                    `🔥 ${projectLamp.logName} DOUBLE CLICK`
                  )

                  onProjectSelect(
                    projectLamp.number
                  )

                }
              }
            >

              <sphereGeometry
                args={[
                  25,
                  25,
                  25
                ]}
              />

              <meshBasicMaterial
                color="#FF00FF"
                transparent
                opacity={0.08}
                depthWrite={false}
              />

            </mesh>


            <ProjectLabel
              number={
                projectLamp.number
              }
              name={
                projectLamp.name
              }
              position={
                projectLamp.position
              }
            />

          </group>

        )
      )}


      <OrbitControls

        ref={controlsRef}

        enableDamping

        dampingFactor={0.08}

        enableRotate={true}

        enablePan={false}

        enableZoom={true}

        zoomSpeed={0.35}

        rotateSpeed={0.3}

        target={[
          0,
          50,
          0
        ]}

        minPolarAngle={
          1.53
        }

        maxPolarAngle={
          1.53
        }

        minAzimuthAngle={
          -0.65
        }

        maxAzimuthAngle={
          0.65
        }

        maxDistance={700}

        minDistance={280}

      />

    </>

  )

}

function RoomDoor({
  name,
  position,
  rotation = [0, 0, 0],
  onEnter,
  disabled = false,
  animateEntry = false,
  controlsRef,
}) {

  const [hovered, setHovered] =
    useState(false)
  
  const { camera } = useThree()  
  const handleEnter = () => {

    if (disabled) {
      return
    }

    // Normal doors
    if (!animateEntry) {
      onEnter()
      return
    }

    // ========================================
    // 🎥 STOP CAMERA CONTROLS
    // ========================================

    if (controlsRef?.current) {
      controlsRef.current.enabled = false
    }


    // ========================================
    // 🚪 AMETHYST DOOR POSITION
    // ========================================

    const doorPosition =
      new THREE.Vector3(
        position[0],
        position[1],
        position[2]
      )


    // ========================================
    // 📷 CAMERA DIRECTION
    // ========================================

    const direction =
      new THREE.Vector3()
        .subVectors(
          doorPosition,
          camera.position
        )
        .normalize()


    // ========================================
    // 🎯 CAMERA STOP POSITION
    // ========================================

    const cameraTarget =
      doorPosition
        .clone()
        .sub(
          direction.multiplyScalar(
            1.8
          )
        )

    cameraTarget.y += 0.3


    // ========================================
    // 🎥 MOVE TOWARD DOOR
    // ========================================

    gsap.to(
      camera.position,
      {

        x:
          cameraTarget.x,

        y:
          cameraTarget.y,

        z:
          cameraTarget.z,

        duration:
          2.5,

        ease:
          'power3.inOut',

        onUpdate: () => {

          camera.lookAt(
            doorPosition
          )

        },

        onComplete: () => {

          console.log(
            '💜 CAMERA REACHED AMETHYST DOOR'
          )


          // 🔊 PLAY AMETHYST DOOR SOUND

          const doorSound =
            new Audio(
              '/sounds/amethyst-door.mp3'
            )

          doorSound.volume = 0.8

          doorSound.play()
            .catch((error) => {

              console.log(
                '🔊 Amethyst door sound failed:',
                error
              )

            })


          // 🚪 ENTER AMETHYST

          onEnter()

        }

      }
    )
  }

  return (
    <group
      position={position}
      rotation={rotation}
    >

      {/* Invisible / subtle interaction area */}
      <mesh

        onPointerOver={(event) => {

          event.stopPropagation()

          setHovered(true)

          document.body.style.cursor =
            disabled
              ? 'default'
              : 'pointer'

        }}

        onPointerOut={(event) => {

          event.stopPropagation()

          setHovered(false)

          document.body.style.cursor =
            'default'

        }}

        onPointerUp={(event) => {

          if (
            event.pointerType !== 'touch'
          ) {
            return
          }

          event.stopPropagation()

          if (disabled) {
            return
          }

          handleEnter()

        }}

        onDoubleClick={(event) => {

          event.stopPropagation()

          if (disabled) {
            return
          }

          handleEnter()

        }}

      >

        <boxGeometry
          args={[
            2.8,
            4,
            0.25
          ]}
        />

        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={
            hovered
              ? 0.16
              : 0
          }
          depthWrite={false}
        />

      </mesh>


      {/* Always-visible room label */}

      <Html
        center
        position={[
          0,
          2.4,
          0
        ]}
        distanceFactor={8}
      >

        <div
          style={{

            color:
              hovered
                ? '#FFFFFF'
                : 'rgba(255,255,255,0.72)',

            fontFamily:
              "'Shippori Mincho', serif",

            fontSize:
              '18px',

            fontWeight:
              '600',

            letterSpacing:
              '5px',

            whiteSpace:
              'nowrap',

            textShadow:
              hovered
                ? '0 0 8px #A855F7, 0 0 20px #A855F7'
                : '0 0 6px rgba(168,85,247,0.35)',

            pointerEvents:
              'none',

            userSelect:
              'none',
 
            transition:
              'all 0.2s ease',

            opacity:1

          }}
        >

          {name}

        </div>

      </Html>

    </group>
  )
}

function HauntedHouse({
  onEnter,
  onEnterAmethyst,
  onEnterSchool,
  onEnterThrone
}) {

  const {
    scene
  } =
    useGLTF(
      '/models/haunted-house.glb'
    )

  const {
    camera
  } =
    useThree()

  const controlsRef =
    useRef()

  const [
    doorHovered,
    setDoorHovered
  ] =
    useState(false)

  const [
    entering,
    setEntering
  ] =
    useState(false)


  useEffect(() => {

    scene.visible =
      true

    scene.position.set(
      0,
      0,
      0
    )

    scene.rotation.set(
      0,
      0,
      0
    )

    scene.updateWorldMatrix(
      true,
      true
    )

    const box =
      new THREE.Box3()
        .setFromObject(scene)

    const center =
      new THREE.Vector3()

    const size =
      new THREE.Vector3()

    box.getCenter(center)

    box.getSize(size)

    console.log(
      '🏚️ HOUSE SIZE:',
      size.x,
      size.y,
      size.z
    )

    console.log(
      '🏚️ HOUSE POSITION:',
      scene.position.x,
      scene.position.y,
      scene.position.z
    )

    scene.position.x -=
      center.x

    scene.position.y -=
      center.y

    scene.position.z -=
      center.z

    const maxDimension =
      Math.max(
        size.x,
        size.y,
        size.z
      )

    const distance =
      (maxDimension / 2) /
      Math.tan(
        THREE.MathUtils.degToRad(
          camera.fov / 2
        )
      )


    camera.position.set(

      distance * 10,

      distance * 0.45,

      distance * 0.85

    )

    camera.lookAt(
      0,
      0,
      0
    )


    if (
      controlsRef.current
    ) {

      controlsRef.current.enabled =
        true

      controlsRef.current.enableRotate =
        true

      controlsRef.current.enablePan =
        false

      controlsRef.current.enableZoom =
        true

      controlsRef.current.minPolarAngle =
        0

      controlsRef.current.maxPolarAngle =
        Math.PI

      controlsRef.current.minAzimuthAngle =
        -Infinity

      controlsRef.current.maxAzimuthAngle =
        Infinity

      controlsRef.current.maxDistance =
        distance

      controlsRef.current.minDistance =
        distance * 0.12

      controlsRef.current.target.set(
        0,
        0,
        0
      )

      controlsRef.current.update()

    }


    camera.near =
      0.01

    camera.far =
      maxDimension * 50

    camera.updateProjectionMatrix()


    scene.traverse(
      (object) => {

        if (!object.isMesh)
          return

        if (
          object.material
        ) {

          object.material.side =
            THREE.DoubleSide

        }

        object.raycast =
          () => {}

      }
    )

  }, [
    scene,
    camera
  ])


  return (

    <>

      <primitive
        object={scene}
        scale={1}
      />
      {/* ==================================================
              ROOM ENTRANCES
          ================================================== */}


          {/* AMETHYST LIBRARY — SKILLS / EXPERIMENTS */}

          <RoomDoor

            name="ＴＷＯ"

            position={[
              4,
              0.5,
              0.4
            ]}

            rotation={[
              0,
              Math.PI / 2,
              0
            ]}

            disabled={false}

            animateEntry={true}

            controlsRef={controlsRef}

            onEnter={
              onEnterAmethyst
            }

          />


          {/* SCHOOL ROOM — EDUCATION / JOURNEY */}

          <RoomDoor

            name="ＴＨＲＥＥ"

            position={[
              4.9,
              7,
              0.4
            ]}

            rotation={[
              0,
              Math.PI / 2,
              0
            ]}

            disabled={false}

            animateEntry={true}

            controlsRef={controlsRef}

            onEnter={() => {

              console.log(
                '🏫 THREE CLICKED'
              )

              onEnterSchool()

            }}

          />


          {/* THRONE ROOM — ABOUT / ACHIEVEMENTS */}

          <RoomDoor

            name="ＦＯＵＲ"

            position={[
              -8,
              14,
              -8
            ]}

            rotation={[
              0,
              Math.PI / 2,
              0
            ]}

            disabled={false}

            animateEntry={true}

            controlsRef={controlsRef}

            onEnter={() => {

              console.log(
                '👑 ENTERING THRONE ROOM'
              )

              onEnterThrone()

            }}

          />


      <mesh

        position={[
          6.5,
          -4.5,
          1.5
        ]}

        rotation={[
          0,
          Math.PI / 2,
          0
        ]}

        onPointerOver={
          (event) => {

            event.stopPropagation()

            setDoorHovered(
              true
            )

            document.body.style.cursor =
              'pointer'

          }
        }

        onPointerOut={
          (event) => {

            event.stopPropagation()

            setDoorHovered(
              false
            )

            document.body.style.cursor =
              'default'

          }
        }


        onPointerUp={(event) => {

          if (
            event.pointerType !== 'touch'
          ) {
            return
          }

          event.stopPropagation()

          if (entering) {
            return
          }

          console.log(
            '🚪 TOUCH ENTERING LIBRARY'
          )

          setEntering(true)

          setDoorHovered(false)

          document.body.style.cursor =
            'default'


          // 🔊 PLAY DOOR SOUND
          const doorSound =
            new Audio(
              '/sounds/door-opening.mp3'
            )

          doorSound.volume = 0.8

          doorSound.play()
            .then(() => {

              console.log(
                '🔊 DOOR SOUND PLAYING'
              )

            })
            .catch((error) => {

              console.error(
                '🔊 DOOR SOUND FAILED:',
                error
              )

            })


          // Enter library
          onEnter()

        }}


        onDoubleClick={
          (event) => {

            event.stopPropagation()

            if (entering)
              return

            console.log(
              '🚪 ENTERING LIBRARY'
            )

            setEntering(
              true
            )

            setDoorHovered(
              false
            )

            document.body.style.cursor =
              'default'


            if (
              controlsRef.current
            ) {

              controlsRef.current.enabled =
                false

            }


            const doorPosition =
              new THREE.Vector3(
                6.5,
                -4.5,
                1.5
              )


            const direction =
              new THREE.Vector3()
                .subVectors(
                  doorPosition,
                  camera.position
                )
                .normalize()


            const cameraTarget =
              doorPosition
                .clone()
                .sub(
                  direction.multiplyScalar(
                    1.8
                  )
                )


            cameraTarget.y +=
              0.3


            gsap.to(
              camera.position,
              {

                x:
                  cameraTarget.x,

                y:
                  cameraTarget.y,

                z:
                  cameraTarget.z,

                duration:
                  2.5,

                ease:
                  'power3.inOut',

                onUpdate:
                  () => {

                    camera.lookAt(
                      doorPosition
                    )

                  },

                onComplete:
                  () => {

                    console.log(
                      '🚪 CAMERA REACHED DOOR'
                    )

                    const doorSound =
                      new Audio(
                        '/sounds/door-opening.mp3'
                      )

                    doorSound.volume =
                      0.8

                    doorSound
                      .play()
                      .catch(
                        (error) => {

                          console.log(
                            '🔊 Door sound failed:',
                            error
                          )

                        }
                      )

                    onEnter()

                  }

              }
            )

          }
        }

      >

        <boxGeometry
          args={[
            2.4,
            3,
            0.15
          ]}
        />

        <meshBasicMaterial

          color="#A855F7"

          transparent

          opacity={
            doorHovered
              ? 0.16
              : 0
          }

          depthWrite={
            false
          }

        />


        {!entering && (
          <Html
            center
            distanceFactor={8}
            position={[
              0,
              1.8,
              0
            ]}
          >
            <div
              style={{
                color: '#FFFFFF',

                fontSize: '18px',

                letterSpacing: '4px',

                fontFamily:
                  'Arial, Helvetica, sans-serif',

                fontWeight: '500',

                whiteSpace: 'nowrap',

                textShadow:
                  '0 0 8px #A855F7, 0 0 20px #A855F7',

                pointerEvents: 'none',

                userSelect: 'none',

                opacity: doorHovered
                  ? 1
                  : 0.65,

                transition:
                  'opacity 0.2s ease',
              }}
            >
              ＯＮＥ
            </div>
          </Html>
        )}

      </mesh>


      <OrbitControls

        ref={controlsRef}

        enableDamping

        dampingFactor={0.08}

        enablePan={false}

        enableZoom={true}

        zoomSpeed={0.5}

        rotateSpeed={0.35}

        target={[
          0,
          7,
          0
        ]}

      />

    </>

  )

}


function ProjectWindow({
  project,
  onClose
}) {

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          event.key ===
          'Escape'
        ) {

          onClose()

        }

      }


    window.addEventListener(
      'keydown',
      handleKeyDown
    )


    return () => {

      window.removeEventListener(
        'keydown',
        handleKeyDown
      )

    }

  }, [
    onClose
  ])


  if (!project)
    return null


  return (

    <div

      style={{

        position:
          'fixed',

        inset: 0,

        zIndex: 1000,

        display: 'flex',

        alignItems:
          'center',

        justifyContent:
          'center',

        padding:
          '20px',

        background:
          'rgba(0, 0, 0, 0.78)',

        backdropFilter:
          'blur(6px)',

        WebkitBackdropFilter:
          'blur(6px)',

        animation:
          'projectOverlayIn 0.45s ease forwards',

        boxSizing:
          'border-box',

      }}

      onMouseDown={
        (event) => {

          if (
            event.target ===
            event.currentTarget
          ) {

            onClose()

          }

        }
      }

    >


      <div

        className=
          "project-journal"

        style={{

          position:
            'relative',

          width:
            'min(1200px, 96vw)',

          aspectRatio:
            '16 / 10',

          maxHeight:
            '92vh',

          overflow:
            'hidden',

          animation:
            'projectJournalIn 0.65s cubic-bezier(.2,.8,.2,1)',

          boxShadow:
            '0 30px 100px rgba(0,0,0,0.8)',

          borderRadius:
            '4px',

        }}

      >


        <img

          src=
            "/images/project-journal-bg.png"

          alt=
            "Project journal"

          style={{

            position:
              'absolute',

            inset:
              0,

            width:
              '100%',

            height:
              '100%',

            objectFit:
              'cover',

            display:
              'block',

            userSelect:
              'none',

            pointerEvents:
              'none',

          }}

        />


        <div

          style={{

            position:
              'absolute',

            inset:
              0,

            background:
              'linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.10))',

            pointerEvents:
              'none',

          }}

        />


        <button

          className=
            "project-close"

          onClick={
            onClose
          }

          style={{

            position:
              'absolute',

            top:
              '5%',

            right:
              '11.4%',

            width:
              '42px',

            height:
              '42px',

            borderRadius:
              '50%',

            border:
              '1px solid rgba(255,255,255,0.45)',

            background:
              'rgba(15,10,20,0.72)',

            color:
              '#FFFFFF',

            fontSize:
              '25px',

            lineHeight:
              '1',

            cursor:
              'pointer',

            zIndex:
              20,

            display:
              'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            transition:
              'all 0.2s ease',

            boxShadow:
              '0 0 15px rgba(0,0,0,0.45)',

          }}

          onMouseEnter={
            (event) => {

              event.currentTarget.style.transform =
                'scale(1.1)'

              event.currentTarget.style.background =
                'rgba(168,85,247,0.55)'

            }
          }

          onMouseLeave={
            (event) => {

              event.currentTarget.style.transform =
                'scale(1)'

              event.currentTarget.style.background =
                'rgba(15,10,20,0.72)'

            }
          }

        >

          ×

        </button>


        <div

          className=
            "project-number"

          style={{

            position:
              'absolute',

            top:
              '13%',

            left:
              '13%',

            zIndex:
              10,

            color:
              '#E8D6B0',

            fontFamily:
              'Georgia, "Times New Roman", serif',

            fontSize:
              'clamp(18px, 4.4vw, 22px)',

            letterSpacing:
              '4px',

            fontWeight:
              '700',

            textShadow:
              '0 2px 5px rgba(0,0,0,0.7)',

          }}

        >

          {
            String(
              project.id
            ).padStart(
              2,
              '0'
            )
          }

        </div>


        <div

          className=
            "project-image-frame"

          style={{

            position:
              'absolute',

            left:
              '19%',

            top:
              '16%',

            width:
              '28%',

            height:
              '70%',

            zIndex:
              5,

            overflow:
              'hidden',

            borderRadius:
              '2px',

            background:
              'rgba(10,8,12,0.8)',

            boxShadow:
              '0 10px 30px rgba(0,0,0,0.45)',

            border:
              '1px solid rgba(255,255,255,0.12)',

          }}

        >

          <img

            src={
              project.image
            }

            alt={
              project.name
            }

            style={{

              width:
                '100%',

              height:
                '100%',

              objectFit:
                'cover',

              display:
                'block',

            }}

            onError={
              (event) => {

                event.currentTarget.style.display =
                  'none'

                event.currentTarget.parentElement.style.background =
                  'rgba(15,10,20,0.75)'

                event.currentTarget.parentElement.innerHTML =
                  '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#cfc1aa;font:12px Arial;letter-spacing:3px;">PROJECT IMAGE</div>'

              }
            }

          />

        </div>


        <div

          className=
            "project-info"

          style={{

            position:
              'absolute',

            left:
              '52%',

            top:
              '25%',

            width:
              '36%',

            zIndex:
              10,

            color:
              '#FFFFFF',

            textShadow:
              '0 2px 5px rgba(0,0,0,0.65)',

          }}

        >

          <h1

            style={{

              margin:
                0,

              fontFamily:
                'Georgia, "Times New Roman", serif',

              fontSize:
                'clamp(24px, 3.2vw, 48px)',

              lineHeight:
                1,

              letterSpacing:
                '2px',

              fontWeight:
                '700',

              color:
                '#F1E5CF',

            }}

          >

            {
              project.name
            }

          </h1>


          <div

            style={{

              marginTop:
                '10px',

              fontFamily:
                'Arial, Helvetica, sans-serif',

              fontSize:
                'clamp(10px, 1vw, 14px)',

              letterSpacing:
                '3px',

              textTransform:
                'uppercase',

              color:
                'rgba(235,220,195,0.82)',

            }}

          >

            {
              project.subtitle
            }

          </div>


          <div

            style={{

              width:
                '90px',

              height:
                '1px',

              margin:
                '22px 0',

              background:
                'rgba(225,196,140,0.7)',

            }}

          />


          <p

            style={{

              margin:
                0,

              maxWidth:
                '500px',

              fontFamily:
                'Arial, Helvetica, sans-serif',

              fontSize:
                'clamp(12px, 1.15vw, 17px)',

              lineHeight:
                1.7,

              color:
                'rgba(245,238,225,0.9)',

            }}

          >

            {
              project.description
            }

          </p>


          <div

            style={{

              marginTop:
                '24px',

              fontFamily:
                'Arial, Helvetica, sans-serif',

              fontSize:
                '10px',

              letterSpacing:
                '3px',

              color:
                '#D9C18E',

              marginBottom:
                '10px',

            }}

          >

            TECHNOLOGIES

          </div>


          <div

            style={{

              display:
                'flex',

              flexWrap:
                'wrap',

              gap:
                '7px',

            }}

          >

            {
              project.technologies.map(
                (technology) => (

                  <span

                    key={
                      technology
                    }

                    style={{

                      padding:
                        '6px 10px',

                      border:
                        '1px solid rgba(220,190,135,0.5)',

                      background:
                        'rgba(0,0,0,0.28)',

                      color:
                        '#E7D8B8',

                      fontFamily:
                        'Arial, Helvetica, sans-serif',

                      fontSize:
                        '10px',

                      letterSpacing:
                        '1px',

                      borderRadius:
                        '2px',

                    }}

                  >

                    {
                      technology
                    }

                  </span>

                )
              )
            }

          </div>


          <div

            className=
              "project-buttons"

            style={{

              display:
                'flex',

              flexWrap:
                'wrap',

              gap:
                '12px',

              marginTop:
                '28px',

            }}

          >

            <a

              className=
                "project-button project-button-primary"

              href={
                project.liveUrl
              }

              target="_blank"

              rel="noreferrer"

              onMouseEnter={
                (event) => {

                  event.currentTarget.style.transform =
                    'translateY(-2px)'

                  event.currentTarget.style.boxShadow =
                    '0 0 22px rgba(168,85,247,0.45), inset 0 0 15px rgba(168,85,247,0.15)'

                }
              }

              onMouseLeave={
                (event) => {

                  event.currentTarget.style.transform =
                    'translateY(0)'

                  event.currentTarget.style.boxShadow =
                    '0 0 12px rgba(168,85,247,0.18), inset 0 0 12px rgba(168,85,247,0.08)'

                }
              }

              style={{

                display:
                  'inline-flex',

                alignItems:
                  'center',

                justifyContent:
                  'center',

                padding:
                  '12px 20px',

                minWidth:
                  '155px',

                background:
                  'linear-gradient(135deg, rgba(70,35,95,0.88), rgba(25,15,35,0.92))',

                border:
                  '1px solid rgba(216,178,104,0.75)',

                color:
                  '#F2DFB5',

                textDecoration:
                  'none',

                fontFamily:
                  'Arial, Helvetica, sans-serif',

                fontSize:
                  '11px',

                fontWeight:
                  '700',

                letterSpacing:
                  '2px',

                borderRadius:
                  '2px',

                boxShadow:
                  '0 0 12px rgba(168,85,247,0.18), inset 0 0 12px rgba(168,85,247,0.08)',

                transition:
                  'all 0.25s ease',

                cursor:
                  'pointer',

              }}

            >

              VIEW PROJECT ↗

            </a>


            <a

              className=
                "project-button project-button-secondary"

              href={
                project.githubUrl
              }

              target="_blank"

              rel="noreferrer"

              onMouseEnter={
                (event) => {

                  event.currentTarget.style.transform =
                    'translateY(-2px)'

                  event.currentTarget.style.borderColor =
                    'rgba(216,178,104,0.65)'

                  event.currentTarget.style.boxShadow =
                    '0 0 16px rgba(216,178,104,0.18)'

                }
              }

              onMouseLeave={
                (event) => {

                  event.currentTarget.style.transform =
                    'translateY(0)'

                  event.currentTarget.style.borderColor =
                    'rgba(255,255,255,0.28)'

                  event.currentTarget.style.boxShadow =
                    '0 0 10px rgba(0,0,0,0.25)'

                }
              }

              style={{

                display:
                  'inline-flex',

                alignItems:
                  'center',

                justifyContent:
                  'center',

                padding:
                  '12px 20px',

                minWidth:
                  '125px',

                background:
                  'rgba(15,10,22,0.55)',

                border:
                  '1px solid rgba(255,255,255,0.28)',

                color:
                  '#E8DCC7',

                textDecoration:
                  'none',

                fontFamily:
                  'Arial, Helvetica, sans-serif',

                fontSize:
                  '11px',

                fontWeight:
                  '700',

                letterSpacing:
                  '2px',

                borderRadius:
                  '2px',

                boxShadow:
                  '0 0 10px rgba(0,0,0,0.25)',

                transition:
                  'all 0.25s ease',

                cursor:
                  'pointer',

              }}

            >

              GITHUB ↗

            </a>

          </div>

        </div>


        <div

          className=
            "project-instruction"

          style={{

            position:
              'absolute',

            bottom:
              '7%',

            right:
              '10%',

            zIndex:
              10,

            color:
              'rgba(230,215,190,0.7)',

            fontFamily:
              'Arial, Helvetica, sans-serif',

            fontSize:
              '9px',

            letterSpacing:
              '2px',

          }}

        >

          ESC · CLOSE

        </div>


      </div>


      <style>{`

        @keyframes projectOverlayIn {

          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }

        }


        @keyframes projectJournalIn {

          from {

            opacity: 0;

            transform:
              scale(0.92)
              translateY(25px);

          }

          to {

            opacity: 1;

            transform:
              scale(1)
              translateY(0);

          }

        }


        @media (max-width: 700px) {

          html,
          body,
          #root {

            width:
              100%;

            height:
              100%;

            margin:
              0;

            overflow:
              hidden;

          }


          .scene-root {

            width:
              100% !important;

            height:
              100dvh !important;

            min-height:
              100dvh !important;

            overflow:
              hidden !important;

            touch-action:
              none;

          }


          .library-exit-button {

            top:
              max(
                14px,
                env(safe-area-inset-top)
              ) !important;

            left:
              max(
                14px,
                env(safe-area-inset-left)
              ) !important;

            padding:
              12px 14px !important;

            min-height:
              44px !important;

            font-size:
              10px !important;

            letter-spacing:
              1.5px !important;

            border-radius:
              3px !important;

          }


          .project-journal {

            width:
              96vw !important;

            height:
              92dvh !important;

            max-height:
              92dvh !important;

            aspect-ratio:
              auto !important;

            overflow-y:
              auto !important;

            overflow-x:
              hidden !important;

            -webkit-overflow-scrolling:
              touch;

            border-radius:
              5px !important;

          }


          .project-journal > img {

            object-fit:
              fill !important;

          }


          .project-close {

            top:
              3% !important;

            right:
              4% !important;

            width:
              42px !important;

            height:
              42px !important;

            font-size:
              24px !important;

          }


          .project-number {

            top:
              5% !important;

            left:
              8% !important;

            font-size:
              18px !important;

            letter-spacing:
              3px !important;

          }


          .project-image-frame {

            left:
              8% !important;

            top:
              14% !important;

            width:
              84% !important;

            height:
              30% !important;

          }


          .project-info {

            position:
              absolute !important;

            left:
              8% !important;

            top:
              48% !important;

            width:
              84% !important;

            padding-bottom:
              30px !important;

          }


          .project-info h1 {

            font-size:
              clamp(
                24px,
                8vw,
                34px
              ) !important;

            line-height:
              1.05 !important;

            letter-spacing:
              1px !important;

          }


          .project-info > div {

            font-size:
              9px !important;

            letter-spacing:
              2px !important;

          }


          .project-info p {

            font-size:
              12px !important;

            line-height:
              1.55 !important;

          }


          .project-info span {

            font-size:
              9px !important;

            padding:
              6px 8px !important;

          }


          .project-buttons {

            flex-direction:
              column !important;

            width:
              100% !important;

            gap:
              9px !important;

            margin-top:
              20px !important;

          }


          .project-button {

            width:
              100% !important;

            min-width:
              0 !important;

            min-height:
              44px !important;

            box-sizing:
              border-box !important;

            padding:
              11px 14px !important;

            font-size:
              10px !important;

            letter-spacing:
              1.5px !important;

          }


          .project-instruction {

            display:
              none !important;

          }

        }


        @media (max-width: 380px) {

          .project-journal {

            width:
              98vw !important;

            height:
              94dvh !important;

          }


          .project-image-frame {

            top:
              13% !important;

            height:
              28% !important;

          }


          .project-info {

            top:
              45% !important;

          }


          .project-info p {

            font-size:
              11px !important;

          }

        }

      `}</style>

    </div>

  )

}


function Scene() {

  const [
    currentRoom,
    setCurrentRoom
  ] =
    useState('house')


  const [
    transitioning,
    setTransitioning
  ] =
    useState(false)


  const [
    hoveredProject,
    setHoveredProject
  ] =
    useState(null)


  const [
    selectedProject,
    setSelectedProject
  ] =
    useState(null)


  const [
    amethystFlash,
    setAmethystFlash
  ] =
    useState(false)


  const [
    amethystArchiveOpen,
    setAmethystArchiveOpen
  ] =
    useState(false)


  const themeAudioRef =
    useRef(null)


  useEffect(() => {

    let audio = null

    const startTheme = async () => {

      if (audio) {
        return
      }

      audio = new Audio(
        '/sounds/theme.mp3'
      )

      audio.loop = true

      audio.volume = 0.35

      try {

        await audio.play()

        console.log(
          '🎵 THEME PLAYING'
        )

        themeAudioRef.current =
          audio

        document.removeEventListener(
          'pointerdown',
          startTheme
        )

        document.removeEventListener(
          'touchstart',
          startTheme
        )

        document.removeEventListener(
          'click',
          startTheme
        )

      } catch (error) {

        console.log(
          '🎵 Theme playback waiting for interaction:',
          error
        )

        audio = null

      }

    }


    document.addEventListener(
      'pointerdown',
      startTheme,
      { passive: true }
    )

    document.addEventListener(
      'touchstart',
      startTheme,
      { passive: true }
    )

    document.addEventListener(
      'click',
      startTheme,
      { passive: true }
    )


    return () => {

      document.removeEventListener(
        'pointerdown',
        startTheme
      )

      document.removeEventListener(
        'touchstart',
        startTheme
      )

      document.removeEventListener(
        'click',
        startTheme
      )


      if (
        themeAudioRef.current
      ) {

        themeAudioRef.current.pause()

        themeAudioRef.current.currentTime =
          0

        themeAudioRef.current =
          null

      }

    }

  }, [])


  useEffect(() => {

    const handleProjectKey =
      (event) => {

        if (
          event.key.toLowerCase() ===
            'e' &&
          hoveredProject
        ) {

          setSelectedProject(
            hoveredProject
          )

        }

      }


    window.addEventListener(
      'keydown',
      handleProjectKey
    )


    return () => {

      window.removeEventListener(
        'keydown',
        handleProjectKey
      )

    }

  }, [
    hoveredProject
  ])


  const enterLibrary =
    () => {

      setTransitioning(
        true
      )


      setTimeout(
        () => {

          setCurrentRoom(
            'library'
          )

        },
        1300
      )

    }


  const exitLibrary =
    () => {

      console.log(
        '🚪 EXITING LIBRARY'
      )


      setSelectedProject(
        null
      )


      setHoveredProject(
        null
      )


      setTransitioning(
        true
      )


      setTimeout(
        () => {

          setCurrentRoom(
            'house'
          )

        },
        1300
      )


      setTimeout(
        () => {

          setTransitioning(
            false
          )

        },
        1900
      )

    }
    const enterAmethyst = () => {

      console.log(
        '💜 ENTERING AMETHYST LIBRARY'
      )

      setTransitioning(true)

      setTimeout(() => {

        setCurrentRoom(
          'amethyst'
        )

      }, 1300)

      setTimeout(() => {

        setTransitioning(
          false
        )

      }, 1900)

    }
    const enterSchool = () => {

      console.log(
        '🏫 ENTERING SCHOOL ROOM'
      )

      setTransitioning(true)

      setTimeout(() => {

        setCurrentRoom(
          'school'
        )

      }, 1300)

      setTimeout(() => {

        setTransitioning(
          false
        )

      }, 1900)

    }
    const enterThrone = () => {

      setTransitioning(true)

      setTimeout(() => {

        setCurrentRoom(
          'throne'
        )

      }, 1300)


      setTimeout(() => {

        setTransitioning(false)

      }, 1900)

    }


  const libraryReady =
    () => {

      console.log(
        '📚 LIBRARY READY'
      )


      setTimeout(
        () => {

          setTransitioning(
            false
          )

        },
        500
      )

    }
    const exitAmethyst = () => {

      setTransitioning(true)

      setTimeout(() => {

        setCurrentRoom('house')

        setTransitioning(false)

      }, 1300)

    }
    const exitSchool = () => {

      setTransitioning(true)

      setTimeout(() => {

        setCurrentRoom('house')

        setTransitioning(false)

      }, 1300)

    }
    const exitThrone = () => {

      setTransitioning(true)

      setTimeout(() => {

        setCurrentRoom('house')

        setTransitioning(false)

      }, 1300)

    }


  const projectsForScene =
    PROJECTS


  return (

    <div

      className=
        "scene-root"

      style={{

        width:
          '100%',

        height:
          '100dvh',

        position:
          'relative',

        overflow:
          'hidden',

        backgroundImage:
          "url('/images/night-background.png')",

        backgroundSize:
          'cover',

        backgroundPosition:
          'center',

        backgroundRepeat:
          'no-repeat'

      }}

    >


      <Canvas

        camera={{

          position: [
            5,
            4,
            8
          ],

          fov:
            50

        }}


        gl={{

          antialias:
            true,

          alpha:
            true

        }}


        style={{

          position:
            'absolute',

          inset:
            0,

          background:
            'transparent',

          touchAction:
            'none'

        }}


        dpr={[
          1,
          2
        ]}

      >


        <directionalLight

          position={[
            2,
            10,
            -8
          ]}

          intensity={
            2.2
          }

          color="#CDE8D8"

        />


        <pointLight

          position={[
            0,
            5,
            8
          ]}

          intensity={
            5
          }

          distance={
            25
          }

          decay={
            2
          }

          color="#7C8CFF"

        />


        <pointLight

          position={[
            -8,
            4,
            0
          ]}

          intensity={
            10
          }

          distance={
            30
          }

          decay={
            2
          }

          color="#7C3AED"

        />


        <pointLight

          position={[
            8,
            4,
            -2
          ]}

          intensity={
            8
          }

          distance={
            30
          }

          decay={
            2
          }

          color="#00A896"

        />


        <pointLight

          position={[
            0,
            1.5,
            5
          ]}

          intensity={
            4
          }

          distance={
            10
          }

          decay={
            2
          }

          color="#FF5A36"

        />


        <hemisphereLight

          skyColor="#405C55"

          groundColor="#020308"

          intensity={
            0.65
          }

        />


        {
          currentRoom ===
            'house' && (

            <HauntedHouse
              onEnter={
                enterLibrary
              }
              onEnterAmethyst={
                enterAmethyst
              }
              onEnterSchool={
                enterSchool
              }
              onEnterThrone={
                enterThrone
              }
            />

          )
        }


        {
          currentRoom ===
            'library' && (

            <LibraryRoom

              onReady={
                libraryReady
              }

              onProjectHover={
                setHoveredProject
              }

              onProjectSelect={
                setSelectedProject
              }

            />

          )
        }
        {
          currentRoom === 'amethyst' && (

            <AmethystLibraryRoom
              archiveOpen={amethystArchiveOpen}
              onExit={() => {

                setTransitioning(true)

                setTimeout(() => {

                  setCurrentRoom(
                    'house'
                  )

                }, 1300)

              }}
              onArchiveOpenChange={
                setAmethystArchiveOpen
              }
              onFlashChange={
                setAmethystFlash
              }
              onCloseArchive={() => {
                setAmethystArchiveOpen(false)
                setAmethystFlash(false)
              }}
            />

          )
        }
        {
          currentRoom === 'school' && (

            <SchoolRoom
              onExit={() => {

                setTransitioning(true)

                setTimeout(() => {

                  setCurrentRoom(
                    'house'
                  )

                }, 1300)

                setTimeout(() => {

                  setTransitioning(
                    false
                  )

                }, 1900)

              }}
            />

          )
        }
        {
          currentRoom === 'throne' && (

            <ThroneRoom
              onExit={() => {

                setTransitioning(true)

                setTimeout(() => {

                  setCurrentRoom(
                    'house'
                  )

                }, 1300)

                setTimeout(() => {

                  setTransitioning(
                    false
                  )

                }, 1900)

              }}
            />

          )
        }

      </Canvas>


      {
        currentRoom ===
          'amethyst' &&
        amethystFlash && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',
              background: '#B56CFF',
              zIndex: 999998,
              pointerEvents: 'none'
            }}
          />
        )
      }


      {
        currentRoom === 'amethyst' &&
        amethystArchiveOpen && (

          <div
            className="amethyst-archive"
            style={{
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',

              backgroundImage:
                "url('/archive-bg.png')",

              backgroundSize:
                '100% 100%',

              backgroundPosition:
                'center',

              backgroundRepeat:
                'no-repeat',

              zIndex: 999999,
              pointerEvents: 'auto',
              overflow: 'hidden',
            }}
          >

            
            {/* ==================================================
                    ARCHIVE CLOSE BUTTON
                ================================================== */}

                <button
                  className="project-close"
                  onClick={() => {
                  setAmethystArchiveOpen(false)
                  setAmethystFlash(false)

                  camera.position.set(
                    -6,
                    8,
                    4.35
                  )

                  camera.lookAt(
                    1.25,
                    1.5,
                    0.15
                  )
                }}

                  style={{
                    position: 'absolute',

                    top: '15%',
                    right: '48.5%',

                    width: '42px',
                    height: '42px',

                    borderRadius: '50%',

                    border: '1px solid rgba(255,255,255,0.45)',

                    background: 'rgba(15,10,20,0.72)',

                    color: '#FFFFFF',

                    fontSize: '25px',
                    lineHeight: '1',

                    cursor: 'pointer',

                    zIndex: 20,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    transition: 'all 0.2s ease',

                    boxShadow: '0 0 15px rgba(0,0,0,0.45)',
                  }}

                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform = 'scale(1.1)'
                    event.currentTarget.style.background =
                      'rgba(168,85,247,0.55)'
                  }}

                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform = 'scale(1)'
                    event.currentTarget.style.background =
                      'rgba(15,10,20,0.72)'
                  }}
                >
                  ×
                </button>
            {/* ==================================================
                ARCHIVE TITLE
            ================================================== */}

            <div
              className="archive-title"
              style={{
                position: 'absolute',
                top: '2.5%',
                left: '2%',
                color: '#eadcff',
                fontFamily: 'Georgia, serif',
                pointerEvents: 'none',
              }}
            >

              <div
                style={{
                  fontSize:
                    'clamp(18px, 1.8vw, 30px)',
                  letterSpacing: '0.12em',
                  whiteSpace: 'nowrap',
                }}
              >
                THE AMETHYST ARCHIVE
              </div>

              <div
                style={{
                  marginTop: '5px',
                  fontSize:
                    'clamp(7px, 0.7vw, 12px)',
                  letterSpacing: '0.18em',
                  opacity: 0.75,
                }}
              >
                KNOWLEDGE LIVES FOREVER
              </div>

            </div>


            {/* ==================================================
                PROFESSIONAL ARCHIVE
            ================================================== */}

            <div
              style={{
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40%',
                textAlign: 'center',
                fontFamily: 'Georgia, serif',
                color: '#342032',
                pointerEvents: 'none',
              }}
            >

              <h2
                style={{
                  margin: 0,
                  fontSize:
                    'clamp(12px, 1.45vw, 24px)',
                  letterSpacing: '0.16em',
                  fontWeight: '600',
                }}
              >
           
              </h2>

            </div>


            {/* ==================================================
                ARCHIVE NAVIGATION
            ================================================== */}

            <div
              className="archive-navigation"
              style={{
                position: 'absolute',
                top: '17%',
                left: '2%',
                width: '13%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >

              {[
                '✦  ABOUT ME',
                '⚙  SKILLS',
                '✧  LEARNING',
                '◆  EDUCATION',
                '♜  ACHIEVEMENTS',
                '⌘  CONNECT',
              ].map((item) => (

                <button
                  key={item}
                  style={{
                    width: '100%',
                    padding:
                      'clamp(7px, 0.7vw, 13px) clamp(8px, 0.8vw, 14px)',

                    background:
                      'rgba(10, 5, 12, 0.72)',

                    border:
                      '1px solid rgba(211, 157, 255, 0.35)',

                    color: '#eadcff',

                    fontFamily:
                      'Georgia, serif',

                    fontSize:
                      'clamp(8px, 0.9vw, 15px)',

                    letterSpacing:
                      '0.08em',

                    textAlign:
                      'left',

                    cursor:
                      'pointer',

                    transition:
                      'all 0.25s ease',

                    touchAction:
                      'manipulation',
                  }}

                  onMouseEnter={(e) => {

                    e.currentTarget.style.background =
                      'rgba(100, 45, 130, 0.65)'

                    e.currentTarget.style.borderColor =
                      'rgba(230, 180, 255, 0.8)'

                  }}

                  onMouseLeave={(e) => {

                    e.currentTarget.style.background =
                      'rgba(20, 8, 25, 0.72)'

                    e.currentTarget.style.borderColor =
                      'rgba(211, 157, 255, 0.35)'

                  }}
                >
                  {item}
                </button>

              ))}

            </div>


            {/* ==================================================
                ABOUT ME
            ================================================== */}

            <div
              className="archive-section archive-about"
              style={{
                position: 'absolute',
                left: '22%',
                top: '18%',
                width: '27%',
                color: '#342032',
                fontFamily: 'Georgia, serif',
              }}
            >

              <div
                style={{
                  fontSize:
                    'clamp(13px, 1.2vw, 21px)',
                  letterSpacing:
                    '0.04em',
                  fontWeight:
                    '600',
                }}
              >
                ✦ ABOUT ME
              </div>

              <div
                style={{
                  marginLeft: '5%',
                  marginTop: '4px',
                  fontSize:
                    'clamp(9px, 0.85vw, 14px)',
                  lineHeight:
                    '1.35',
                }}
              >

                <div
                  style={{
                    fontWeight: '600',
                    marginBottom: '5px',
                  }}
                >
                  Developer • Builder • Explorer
                </div>

                <div>
                  I build creative digital experiences,
                  explore new technology, <br/>and turn ideas
                  into things people can actually experience.
                </div>

              </div>

            </div>


            {/* ==================================================
                SKILLS
            ================================================== */}

            <div
              className="archive-section archive-skills"
              style={{
                position: 'absolute',
                left: '56%',
                top: '18%',
                width: '25%',
                color: '#342032',
                fontFamily: 'Georgia, serif',
              }}
            >

              <div
                style={{
                  fontSize:
                    'clamp(13px, 1.2vw, 21px)',
                  letterSpacing:
                    '0.04em',
                  fontWeight:
                    '600',
                }}
              >
                ⚙ SKILLS
              </div>

              <div
                style={{
                  marginTop: '5px',
                  fontSize:
                    'clamp(8px, 0.72vw, 12px)',
                  lineHeight:
                    '1.45',
                }}
              >

                <div>
                  <strong>FULL-STACK</strong>
                  <br />
                  React • Node.js • Express • MongoDB
                </div>

                <div style={{ marginTop: '4px' }}>
                  <strong>LANGUAGES</strong>
                  <br />
                  JavaScript • TypeScript • Python • C++ • SQL
                </div>

                <div style={{ marginTop: '4px' }}>
                  <strong>CREATIVE WEB</strong>
                  <br />
                  Three.js • GSAP • Framer Motion
                </div>

                <div style={{ marginTop: '4px' }}>
                  <strong>TOOLS</strong>
                  <br />
                  Git • GitHub • Docker • Postman
                </div>

              </div>

            </div>


            {/* ==================================================
                LEARNING
            ================================================== */}

            <div
              className="archive-section archive-learning"
              style={{
                position: 'absolute',
                left: '21%',
                top: '41%',
                width: '27%',
                color: '#342032',
                fontFamily: 'Georgia, serif',
              }}
            >

              <div
                style={{
                  fontSize:
                    'clamp(13px, 1.2vw, 21px)',
                  fontWeight:
                    '600',
                }}
              >
                ✧ LEARNING
              </div>

              <div
                style={{
                  marginLeft: '5%',
                  marginTop: '6px',
                  fontSize:
                    'clamp(8px, 0.75vw, 13px)',
                  lineHeight:
                    '1.45',
                }}
              >

                <strong>CURRENTLY EXPLORING</strong>

                <div style={{ marginTop: '5px' }}>
                  Full-stack development,
                  creative web experiences,
                  3D on the web, <br/>and new
                  technologies.
                </div>

                <div
                  style={{
                    marginTop: '7px',
                    fontStyle: 'italic',
                  }}
                >
                  Always learning.
                  Always building.
                </div>

              </div>

            </div>


            {/* ==================================================
                EDUCATION
            ================================================== */}

            <div
              className="archive-section archive-education"
              style={{
                position: 'absolute',
                left: '56%',
                top: '41%',
                width: '25%',
                color: '#342032',
                fontFamily: 'Georgia, serif',
              }}
            >

              <div
                style={{
                  fontSize:
                    'clamp(13px, 1.2vw, 21px)',
                  fontWeight:
                    '600',
                }}
              >
                ◆ EDUCATION
              </div>

              <div
                style={{
                  marginTop: '5px',
                  fontSize:
                    'clamp(8px, 0.75vw, 13px)',
                  lineHeight:
                    '1.4',
                }}
              >

                <strong>
                  CHANDIGARH UNIVERSITY
                </strong>

                <div>
                  B.Tech — Computer Science
                  & Engineering
                </div>

                <div style={{ marginTop: '3px' }}>
                  Expected Graduation: 2028
                </div>

                <div>
                  5th Semester • CGPA: 7.83 / 10
                </div>

              </div>

            </div>


            {/* ==================================================
                ACHIEVEMENTS
            ================================================== */}

            <div
              className="archive-section archive-achievements"
              style={{
                position: 'absolute',
                left: '20%',
                top: '64%',
                width: '28%',
                color: '#342032',
                fontFamily: 'Georgia, serif',
              }}
            >

              <div
                style={{
                  fontSize:
                    'clamp(13px, 1.2vw, 21px)',
                  fontWeight:
                    '600',
                }}
              >
                ♜ ACHIEVEMENTS
              </div>

              <div
                style={{
                  marginTop: '5px',
                  marginLeft: '5%',
                  fontSize:
                    'clamp(8px, 0.72vw, 12px)',
                  lineHeight:
                    '1.45',
                }}
              >

                

                <div>
                  <strong>2nd Place</strong> — School Chess
                </div>

                <div>
                  <strong>Hachshastra 2.0 — 2026</strong>
                  <br />
                  Team Leader & Developer
                </div>

                <div>
                  College Hackathons & Technical Events
                </div>

              </div>

            </div>


            {/* ==================================================
                    CONNECT
                ================================================== */}

                <div
                  className="archive-section archive-connect"
                  style={{
                    position: 'absolute',
                    left: '56%',
                    top: '62%',
                    width: '25%',
                    color: '#342032',
                    fontFamily: 'Georgia, serif',
                  }}
                >

                  <div
                    style={{
                      fontSize:
                        'clamp(13px, 1.2vw, 21px)',
                      fontWeight: '600',
                    }}
                  >
                    ⌘ CONNECT
                  </div>

                  <div
                    style={{
                      marginTop: '6px',
                      fontSize:
                        'clamp(8px, 0.72vw, 12px)',
                      lineHeight: '1.5',
                    }}
                  >

                    <div>
                      Have an idea?
                      <br />
                      Want to build something?
                    </div>


                    

                    {/* LINKEDIN */}

                    <a
                      href="https://www.linkedin.com/in/sagar-chhetri-938a7431b/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        marginTop: '4px',
                        color: '#342032',
                        textDecoration: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      ✦ LinkedIn
                    </a>


                    {/* EMAIL */}

                    <a
                      href="mailto:smgsagar087@gmail.com"
                      style={{
                        display: 'block',
                        marginTop: '4px',
                        color: '#342032',
                        textDecoration: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      ✉ Email
                    </a>


                  </div>

                </div>

          </div>
        )
      }


      {
        currentRoom ===
          'library' &&
        selectedProject && (

          <ProjectWindow

            project={
              projectsForScene.find(
                (project) =>
                  project.id ===
                  selectedProject
              )
            }

            onClose={
              () =>
                setSelectedProject(
                  null
                )
            }

          />

        )
      }


      {
        currentRoom ===
          'library' &&
        !selectedProject && (

          <button

            className=
              "library-exit-button"

            onClick={
              exitLibrary
            }

            style={{

              position:
                'absolute',

              top:
                '24px',

              left:
                '24px',

              zIndex:
                50,

              padding:
                '10px 16px',

              display:
                'flex',

              alignItems:
                'center',

              gap:
                '8px',

              background:
                'rgba(8, 6, 12, 0.72)',

              border:
                '1px solid rgba(216, 178, 104, 0.55)',

              color:
                '#E8D6B0',

              fontFamily:
                'Arial, Helvetica, sans-serif',

              fontSize:
                '11px',

              fontWeight:
                '600',

              letterSpacing:
                '2px',

              cursor:
                'pointer',

              backdropFilter:
                'blur(6px)',

              boxShadow:
                '0 0 15px rgba(0,0,0,0.35)',

              transition:
                'all 0.25s ease',

              touchAction:
                'manipulation'

            }}


            onMouseEnter={
              (event) => {

                event.currentTarget.style.background =
                  'rgba(55, 30, 75, 0.85)'

                event.currentTarget.style.borderColor =
                  'rgba(216, 178, 104, 0.9)'

                event.currentTarget.style.boxShadow =
                  '0 0 20px rgba(168,85,247,0.3)'

              }
            }


            onMouseLeave={
              (event) => {

                event.currentTarget.style.background =
                  'rgba(8, 6, 12, 0.72)'

                event.currentTarget.style.borderColor =
                  'rgba(216, 178, 104, 0.55)'

                event.currentTarget.style.boxShadow =
                  '0 0 15px rgba(0,0,0,0.35)'

              }
            }

          >

            <span

              style={{

                fontSize:
                  '16px',

                lineHeight:
                  1,

              }}

            >

              ←

            </span>


            <span>

              EXIT LIBRARY

            </span>

          </button>

        )
      }
      {/* ==================================================
              AMETHYST EXIT
          ================================================== */}

          {currentRoom === 'amethyst' && (
            <button
              onClick={exitAmethyst}

              style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                zIndex: 50,

                padding: '10px 16px',

                display: 'flex',
                alignItems: 'center',
                gap: '8px',

                background:
                  'rgba(8, 6, 12, 0.72)',

                border:
                  '1px solid rgba(216, 178, 104, 0.55)',

                color:
                  '#E8D6B0',

                fontFamily:
                  'Arial, Helvetica, sans-serif',

                fontSize:
                  '11px',

                fontWeight:
                  '600',

                letterSpacing:
                  '2px',

                cursor:
                  'pointer',

                backdropFilter:
                  'blur(6px)',

                boxShadow:
                  '0 0 15px rgba(0,0,0,0.35)',

                transition:
                  'all 0.25s ease',
              }}

              onMouseEnter={(event) => {

                event.currentTarget.style.background =
                  'rgba(55, 30, 75, 0.85)'

                event.currentTarget.style.borderColor =
                  'rgba(216, 178, 104, 0.9)'

                event.currentTarget.style.boxShadow =
                  '0 0 20px rgba(168,85,247,0.3)'

              }}

              onMouseLeave={(event) => {

                event.currentTarget.style.background =
                  'rgba(8, 6, 12, 0.72)'

                event.currentTarget.style.borderColor =
                  'rgba(216, 178, 104, 0.55)'

                event.currentTarget.style.boxShadow =
                  '0 0 15px rgba(0,0,0,0.35)'

              }}
            >

              <span
                style={{
                  fontSize: '16px',
                  lineHeight: 1,
                }}
              >
                ←
              </span>

              <span>
                EXIT LIBRARY
              </span>

            </button>
          )}
          {/* ==================================================
                  SCHOOL ROOM EXIT
              ================================================== */}

              {currentRoom === 'school' && (
                <button
                  onClick={() => {

                    setTransitioning(true)

                    setTimeout(() => {

                      setCurrentRoom('house')

                      setTransitioning(false)

                    }, 1300)

                  }}

                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    zIndex: 50,

                    padding: '10px 16px',

                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',

                    background:
                      'rgba(8, 6, 12, 0.72)',

                    border:
                      '1px solid rgba(216, 178, 104, 0.55)',

                    color:
                      '#E8D6B0',

                    fontFamily:
                      'Arial, Helvetica, sans-serif',

                    fontSize:
                      '11px',

                    fontWeight:
                      '600',

                    letterSpacing:
                      '2px',

                    cursor:
                      'pointer',

                    backdropFilter:
                      'blur(6px)',

                    boxShadow:
                      '0 0 15px rgba(0,0,0,0.35)',

                    transition:
                      'all 0.25s ease',
                  }}

                  onMouseEnter={(event) => {

                    event.currentTarget.style.background =
                      'rgba(55, 30, 75, 0.85)'

                    event.currentTarget.style.borderColor =
                      'rgba(216, 178, 104, 0.9)'

                    event.currentTarget.style.boxShadow =
                      '0 0 20px rgba(168,85,247,0.3)'

                  }}

                  onMouseLeave={(event) => {

                    event.currentTarget.style.background =
                      'rgba(8, 6, 12, 0.72)'

                    event.currentTarget.style.borderColor =
                      'rgba(216, 178, 104, 0.55)'

                    event.currentTarget.style.boxShadow =
                      '0 0 15px rgba(0,0,0,0.35)'

                  }}
                >

                  <span
                    style={{
                      fontSize: '16px',
                      lineHeight: 1,
                    }}
                  >
                    ←
                  </span>

                  <span>
                    EXIT SCHOOL
                  </span>

                </button>
              )}
              {/* ==================================================
                  SCHOOL ROOM EXIT
              ================================================== */}

              {currentRoom === 'throne' && (
                <button
                  onClick={() => {

                    setTransitioning(true)

                    setTimeout(() => {

                      setCurrentRoom('house')

                      setTransitioning(false)

                    }, 1300)

                  }}

                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    zIndex: 50,

                    padding: '10px 16px',

                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',

                    background:
                      'rgba(8, 6, 12, 0.72)',

                    border:
                      '1px solid rgba(216, 178, 104, 0.55)',

                    color:
                      '#E8D6B0',

                    fontFamily:
                      'Arial, Helvetica, sans-serif',

                    fontSize:
                      '11px',

                    fontWeight:
                      '600',

                    letterSpacing:
                      '2px',

                    cursor:
                      'pointer',

                    backdropFilter:
                      'blur(6px)',

                    boxShadow:
                      '0 0 15px rgba(0,0,0,0.35)',

                    transition:
                      'all 0.25s ease',
                  }}

                  onMouseEnter={(event) => {

                    event.currentTarget.style.background =
                      'rgba(55, 30, 75, 0.85)'

                    event.currentTarget.style.borderColor =
                      'rgba(216, 178, 104, 0.9)'

                    event.currentTarget.style.boxShadow =
                      '0 0 20px rgba(168,85,247,0.3)'

                  }}

                  onMouseLeave={(event) => {

                    event.currentTarget.style.background =
                      'rgba(8, 6, 12, 0.72)'

                    event.currentTarget.style.borderColor =
                      'rgba(216, 178, 104, 0.55)'

                    event.currentTarget.style.boxShadow =
                      '0 0 15px rgba(0,0,0,0.35)'

                  }}
                >

                  <span
                    style={{
                      fontSize: '16px',
                      lineHeight: 1,
                    }}
                  >
                    ←
                  </span>

                  <span>
                    EXIT THRONE
                  </span>

                </button>
              )}
              


      <div

        style={{

          position:
            'absolute',

          inset:
            0,

          background:
            '#000',

          pointerEvents:
            'none',

          opacity:
            transitioning
              ? 1
              : 0,

          transition:
            'opacity 1.2s ease',

          zIndex:
            10

        }}
        

      />


    </div>

  )

}


export default Scene