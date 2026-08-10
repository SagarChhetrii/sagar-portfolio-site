import { Canvas, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  useGLTF,
  Html
} from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'


// ======================================================
// LIBRARY ROOM
// ======================================================

function LibraryRoom({ onReady }) {

  const [hoveredProject, setHoveredProject] =
    useState(null)

  const { scene } =
    useGLTF('/models/library.glb')

  const { camera } = useThree()

  const controlsRef = useRef()


  // ==================================================
  // LIBRARY SETUP
  // ==================================================

  useEffect(() => {

    scene.updateWorldMatrix(true, true)


    // ==========================================
    // FIND LIBRARY SIZE
    // ==========================================

    const box =
      new THREE.Box3().setFromObject(scene)

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


    // ==========================================
    // CENTER LIBRARY
    // ==========================================

    scene.position.x -= center.x
    scene.position.y -= center.y
    scene.position.z -= center.z


    // ==========================================
    // LIBRARY CAMERA
    // ==========================================

    const startDistance = 700


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


    // ==========================================
    // MATERIALS
    // ==========================================

    scene.traverse((object) => {

    if (!object.isMesh)
        return

    if (object.material) {

        object.material.side =
        THREE.DoubleSide

    }

    object.raycast = () => {}

    })


    // ==========================================
    // LIBRARY CONTROLS
    // ==========================================

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


      // ========================================
      // FIXED VERTICAL ANGLE
      // ========================================

      controlsRef.current.minPolarAngle =
        1.53

      controlsRef.current.maxPolarAngle =
        1.53


      // ========================================
      // LEFT / RIGHT ROTATION
      // ========================================

      controlsRef.current.minAzimuthAngle =
        -0.65

      controlsRef.current.maxAzimuthAngle =
        0.65


      // ========================================
      // ZOOM
      // ========================================

      controlsRef.current.maxDistance =
        startDistance

      controlsRef.current.minDistance =
        280

      controlsRef.current.zoomSpeed =
        0.35


      controlsRef.current.update()

    }


    // ==========================================
    // ROOM READY
    // ==========================================

    const timer =
      setTimeout(() => {

        onReady()

      }, 300)


    return () =>
      clearTimeout(timer)

  }, [scene, camera, onReady])


  // ==================================================
  // PROJECT HOVER HELPERS
  // ==================================================

  const handleProjectHover =
    (projectNumber) => {

      setHoveredProject(
        projectNumber
      )

    }


  const handleProjectOut =
    () => {

      setHoveredProject(null)

    }


  // ==================================================
  // PROJECT LABEL
  // ==================================================

  const ProjectLabel =
    ({ number, name, position }) => {

      if (
        hoveredProject !== number
      ) {
        return null
      }


      return (

        <Html
          position={position}
          center
          distanceFactor={6}
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 100
          }}
        >

          <div
            style={{
              color: '#FFFFFF',

              fontSize: '16px',

              letterSpacing: '4px',

              fontFamily:
                'Arial, Helvetica, sans-serif',

              fontWeight: '500',

              textShadow:
                '0 0 8px #A855F7, 0 0 20px #A855F7',

              userSelect: 'none',

              pointerEvents: 'none',

              background:
                'rgba(0, 0, 0, 0.45)',

              padding:
                '8px 14px',

              border:
                '1px solid rgba(168, 85, 247, 0.5)',

              borderRadius:
                '4px',

              backdropFilter:
                'blur(4px)'
            }}
          >
            {name}
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
  }, [hoveredProject])


  const projectLamps = [
    {
      number: 1,
      name: 'ONLYSTUDENTS',
      position: [-60, 5, -250],
      labelPosition: [-60, 70, -250],
      logName: 'PROJECT 1'
    },
    {
      number: 2,
      name: 'PROJECT 2',
      position: [-200, 25, -250],
      labelPosition: [-200, 90, -250],
      logName: 'PROJECT 2'
    },
    {
      number: 3,
      name: 'PROJECT 3',
      position: [110, -45, -250],
      labelPosition: [110, 40, -250],
      logName: 'PROJECT 3'
    }
  ]


  // ==================================================
  // RETURN LIBRARY
  // ==================================================

  return (

    <>

      {/* ==========================================
          LIBRARY MODEL
      ========================================== */}

      <primitive
        object={scene}
        scale={1}
      />


      {/* ==========================================
          DARK CEILING
      ========================================== */}

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
          side={THREE.DoubleSide}
          depthWrite={false}
        />

      </mesh>

        {/* ==========================================
            PROJECT LAMP HOTSPOTS
        ========================================== */}


        {projectLamps.map((projectLamp) => (
          <group key={projectLamp.number}>
          <mesh
            position={projectLamp.position}
            scale={hoveredProject === projectLamp.number ? 1.1 : 1}
            onPointerOver={(event) => {
            event.stopPropagation()

            handleProjectHover(
              projectLamp.number
            )

            console.log(
              `🔥 ${projectLamp.logName} HOVER`
            )
            }}
            onPointerOut={(event) => {
            event.stopPropagation()

            handleProjectOut()
            }}
            onDoubleClick={(event) => {
            event.stopPropagation()

            console.log(
              `🔥 ${projectLamp.logName} DOUBLE CLICK`
            )
            }}
          >
            <sphereGeometry
            args={[45, 32, 32]}
            />

            <meshBasicMaterial
            color="#FF00FF"
            transparent
            opacity={0.5}
            depthWrite={false}
            />
          </mesh>

          <ProjectLabel
            number={projectLamp.number}
            name={projectLamp.name}
            position={projectLamp.labelPosition}
          />
          </group>
        ))}


      {/* ==========================================
          LIBRARY CONTROLS
      ========================================== */}

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


        // ========================================
        // FIXED VERTICAL ANGLE
        // ========================================

        minPolarAngle={1.53}

        maxPolarAngle={1.53}


        // ========================================
        // LEFT / RIGHT ONLY
        // ========================================

        minAzimuthAngle={-0.65}

        maxAzimuthAngle={0.65}


        // ========================================
        // ZOOM
        // ========================================

        maxDistance={700}

        minDistance={280}

      />

    </>

  )

}


// ======================================================
// HAUNTED HOUSE
// ======================================================

function HauntedHouse({
  onEnter
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


  // ==================================================
  // HOUSE SETUP
  // ==================================================

  useEffect(() => {

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


    // ==========================================
    // CENTER HOUSE
    // ==========================================

    scene.position.x -=
      center.x

    scene.position.y -=
      center.y

    scene.position.z -=
      center.z


    // ==========================================
    // CAMERA
    // ==========================================

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

      distance * 0.85,

      distance * 0.45,

      distance * 0.85

    )


    camera.lookAt(
      0,
      0,
      0
    )


    // ==========================================
    // CONTROLS
    // ==========================================

    if (controlsRef.current) {

      controlsRef.current.target.set(
        0,
        0,
        0
      )


      controlsRef.current.maxDistance =
        distance


      controlsRef.current.minDistance =
        distance * 0.12


      controlsRef.current.update()

    }


    camera.near =
      0.01


    camera.far =
      maxDimension * 50


    camera.updateProjectionMatrix()


    // ==========================================
    // MATERIALS
    // ==========================================

    scene.traverse((object) => {

    if (!object.isMesh)
        return

    if (object.material) {
        object.material.side =
        THREE.DoubleSide
    }

    object.raycast = () => {}

    })


  }, [
    scene,
    camera
  ])


  // ==================================================
  // RETURN HOUSE
  // ==================================================

  return (

    <>

      {/* ==========================================
          HOUSE MODEL
      ========================================== */}

      <primitive
        object={scene}
        scale={1}
      />


      {/* ==========================================
          DOOR HOTSPOT
      ========================================== */}

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


        onPointerOver={(event) => {

          event.stopPropagation()

          setDoorHovered(true)

          document.body.style.cursor =
            'pointer'

        }}


        onPointerOut={(event) => {

          event.stopPropagation()

          setDoorHovered(false)

          document.body.style.cursor =
            'default'

        }}


        onDoubleClick={(event) => {

          event.stopPropagation()


          if (entering)
            return


          console.log(
            '🚪 ENTERING LIBRARY'
          )


          setEntering(true)

          setDoorHovered(false)


          document.body.style.cursor =
            'default'


          // ========================================
          // STOP USER CONTROL
          // ========================================

          if (controlsRef.current) {

            controlsRef.current.enabled =
              false

          }


          // ========================================
          // DOOR POSITION
          // ========================================

          const doorPosition =
            new THREE.Vector3(
              6.5,
              -4.5,
              1.5
            )


          // ========================================
          // CAMERA DIRECTION
          // ========================================

          const direction =
            new THREE.Vector3()
              .subVectors(
                doorPosition,
                camera.position
              )
              .normalize()


          // ========================================
          // CAMERA TARGET
          // ========================================

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


          // ========================================
          // CAMERA ANIMATION
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
                  '🚪 CAMERA REACHED DOOR'
                )


                // ==================================
                // DOOR SOUND
                // ==================================

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


                // ==================================
                // START BLACK TRANSITION
                // ==================================

                onEnter()

              }

            }
          )

        }}

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
          depthWrite={false}
        />


        {/* ========================================
            ENTER LABEL
        ======================================== */}

        {doorHovered &&
          !entering && (

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

                  color:
                    '#FFFFFF',

                  fontSize:
                    '14px',

                  letterSpacing:
                    '4px',

                  fontFamily:
                    'Arial, Helvetica, sans-serif',

                  fontWeight:
                    '500',

                  whiteSpace:
                    'nowrap',

                  textShadow:
                    '0 0 8px #A855F7, 0 0 20px #A855F7',

                  pointerEvents:
                    'none',

                  userSelect:
                    'none',

                  opacity:
                    0.95

                }}
              >

                ENTER

              </div>

            </Html>

          )}

      </mesh>


      {/* ==========================================
          HOUSE CONTROLS
      ========================================== */}

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
          0,
          0
        ]}

      />

    </>

  )

}


// ======================================================
// MAIN SCENE
// ======================================================

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


  const themeAudioRef =
    useRef(null)


  // ==================================================
  // THEME MUSIC
  // ==================================================

  useEffect(() => {

    const startTheme = () => {

      if (
        themeAudioRef.current
      ) {
        return
      }


      const audio =
        new Audio(
          '/sounds/theme.mp3'
        )


      audio.loop =
        true


      audio.volume =
        0.35


      audio.play()
        .then(() => {

          console.log(
            '🎵 THEME PLAYING'
          )

        })
        .catch(() => {

          console.log(
            '🎵 Theme waiting for user interaction'
          )

        })


      themeAudioRef.current =
        audio


      window.removeEventListener(
        'pointerdown',
        startTheme
      )

    }


    window.addEventListener(
      'pointerdown',
      startTheme
    )


    return () => {

      window.removeEventListener(
        'pointerdown',
        startTheme
      )


      if (
        themeAudioRef.current
      ) {

        themeAudioRef.current.pause()

        themeAudioRef.current =
          null

      }

    }

  }, [])


  // ==================================================
  // ENTER LIBRARY
  // ==================================================

  const enterLibrary = () => {

    setTransitioning(true)


    setTimeout(() => {

      setCurrentRoom(
        'library'
      )

    }, 1300)

  }


  // ==================================================
  // LIBRARY READY
  // ==================================================

  const libraryReady = () => {

    console.log(
      '📚 LIBRARY READY'
    )


    setTimeout(() => {

      setTransitioning(false)

    }, 500)

  }


  // ==================================================
  // MAIN RETURN
  // ==================================================

  return (

    <div
      style={{

        width:
          '100%',

        height:
          '100vh',

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


      {/* ==========================================
          THREE.JS CANVAS
      ========================================== */}

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
            'transparent'

        }}


        dpr={[
          1,
          2
        ]}

      >


        {/* ========================================
            LIGHTING
        ======================================== */}

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


        {/* ========================================
            HAUNTED HOUSE
        ======================================== */}

        {currentRoom ===
          'house' && (

          <HauntedHouse
            onEnter={
              enterLibrary
            }
          />

        )}


        {/* ========================================
            LIBRARY
        ======================================== */}

        {currentRoom ===
          'library' && (

          <LibraryRoom
            onReady={
              libraryReady
            }
          />

        )}

      </Canvas>


      {/* ==========================================
          BLACK TRANSITION
      ========================================== */}

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