import {
  useEffect,
  useRef,
  useState
} from 'react'

import {
  useGLTF,
  OrbitControls
} from '@react-three/drei'

import {
  useThree,
  useFrame
} from '@react-three/fiber'

import * as THREE from 'three'


// ==================================================
// 💜 AMETHYST CAMERA
// ==================================================

const AMETHYST_ROOM_FOCUS =
  new THREE.Vector3(
    1.25,
    1.5,
    0.15
  )


const AMETHYST_ROOM_INITIAL_CAMERA =
  new THREE.Vector3(
    -6.0,
    8.0,
    4.35
  )


const AMETHYST_ROOM_INITIAL_OFFSET =
  new THREE.Vector3().subVectors(
    AMETHYST_ROOM_INITIAL_CAMERA,
    AMETHYST_ROOM_FOCUS
  )


const AMETHYST_ROOM_INITIAL_AZIMUTH =
  Math.atan2(
    AMETHYST_ROOM_INITIAL_OFFSET.x,
    AMETHYST_ROOM_INITIAL_OFFSET.z
  )


const AMETHYST_ROOM_INITIAL_POLAR =
  Math.acos(
    THREE.MathUtils.clamp(
      AMETHYST_ROOM_INITIAL_OFFSET.y /
        AMETHYST_ROOM_INITIAL_OFFSET.length(),
      -1,
      1
    )
  )


// ==================================================
// 📖 BOOK NAME
// ==================================================

const MAGIC_BOOK_NAME =
  'page2_low_10_-_Default_0'


// ==================================================
// 💜 LIBRARY
// ==================================================

function AmethystLibraryRoom({
  onExit,
  onArchiveOpenChange,
  onFlashChange,
  onCloseArchive,
  archiveOpen: externalArchiveOpen
}) {

  // ==================================================
  // 📖 ARCHIVE
  // ==================================================

  const [
    archiveOpen,
    setArchiveOpen
  ] = useState(false)


  const closingArchiveRef =
    useRef(false)


  // ==================================================
  // 📖 ARCHIVE CLOSE SIGNAL
  // ==================================================

  useEffect(() => {

    if (
      externalArchiveOpen === false &&
      archiveOpen
    ) {

      // Start smooth zoom OUT

      closingArchiveRef.current =
        true

      animationProgress.current =
        0

      animationStart.current.copy(
        camera.position
      )

      animationEnd.current.copy(
        AMETHYST_ROOM_INITIAL_CAMERA
      )

      setArchiveOpen(false)

      if (controlsRef.current) {
        controlsRef.current.enabled = false
      }

    }

  }, [
    externalArchiveOpen
  ])


  // ==================================================
  // 📄 ARCHIVE PAGE
  // ==================================================

  const [
    archivePage,
    setArchivePage
  ] = useState('home')


  // ==================================================
  // 💜 FLASH
  // ==================================================

  const [
    purpleFlash,
    setPurpleFlash
  ] = useState(false)


  // ==================================================
  // 🏛️ MODEL
  // ==================================================

  const {
    scene
  } = useGLTF(
    '/models/amethyst-library.glb'
  )


  // ==================================================
  // 📷 CAMERA
  // ==================================================

  const {
    camera
  } = useThree()


  // ==================================================
  // 🎥 CONTROLS
  // ==================================================

  const controlsRef =
    useRef()


  // ==================================================
  // 🎬 ANIMATION REFS
  // ==================================================

  const enteringBookRef =
    useRef(false)


  const animationProgress =
    useRef(0)


  const animationStart =
    useRef(
      new THREE.Vector3()
    )


  const animationEnd =
    useRef(
      new THREE.Vector3()
    )


  const bookTarget =
    useRef(
      new THREE.Vector3()
    )


  // ==================================================
  // 🔊 MAGIC SOUND
  // ==================================================

  const playMagicSound =
    () => {

      try {

        const AudioContext =
          window.AudioContext ||
          window.webkitAudioContext


        const audio =
          new AudioContext()


        const oscillator =
          audio.createOscillator()


        const gain =
          audio.createGain()


        oscillator.type =
          'sine'


        oscillator.frequency.setValueAtTime(
          180,
          audio.currentTime
        )


        oscillator.frequency.exponentialRampToValueAtTime(
          900,
          audio.currentTime + 0.8
        )


        gain.gain.setValueAtTime(
          0.0001,
          audio.currentTime
        )


        gain.gain.exponentialRampToValueAtTime(
          0.2,
          audio.currentTime + 0.08
        )


        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          audio.currentTime + 1
        )


        oscillator.connect(
          gain
        )


        gain.connect(
          audio.destination
        )


        oscillator.start()


        oscillator.stop(
          audio.currentTime + 1
        )


      } catch (
        error
      ) {

        console.log(
          '🔇 MAGIC AUDIO ERROR:',
          error
        )

      }

    }


  // ==================================================
  // 🎬 CINEMATIC CAMERA
  // ==================================================

  useFrame(
    () => {

      if (
        !enteringBookRef.current &&
        !closingArchiveRef.current
      ) {

        return

      }


      animationProgress.current +=
        0.015


      const progress =
        THREE.MathUtils.clamp(
          animationProgress.current,
          0,
          1
        )


      const eased =
        1 -
        Math.pow(
          1 - progress,
          4
        )


      // ----------------------------------------------
      // CAMERA MOVEMENT
      // ----------------------------------------------

      camera.position.lerpVectors(
        animationStart.current,
        animationEnd.current,
        eased
      )


      // ----------------------------------------------
      // LOOK AT BOOK DURING BOTH DIRECTIONS
      // ----------------------------------------------

      camera.lookAt(
        bookTarget.current
      )


      camera.updateProjectionMatrix()


      // ----------------------------------------------
      // ANIMATION FINISHED
      // ----------------------------------------------

      if (
        progress >= 1
      ) {

        // ============================================
        // ZOOM IN FINISHED
        // ============================================

        if (
          enteringBookRef.current
        ) {

          enteringBookRef.current =
            false


          console.log(
            '📖 CAMERA REACHED BOOK'
          )


          setPurpleFlash(
            true
          )


          if (
            onFlashChange
          ) {

            onFlashChange(
              true
            )

          }


          setTimeout(
            () => {

              setPurpleFlash(
                false
              )


              if (
                onFlashChange
              ) {

                onFlashChange(
                  false
                )

              }


              console.log(
                '📖 OPENING ARCHIVE'
              )


              setArchiveOpen(
                true
              )


              if (
                onArchiveOpenChange
              ) {

                onArchiveOpenChange(
                  true
                )

              }

            },
            300
          )

        }


        // ============================================
        // ZOOM OUT FINISHED
        // ============================================

        if (
          closingArchiveRef.current
        ) {

          closingArchiveRef.current =
            false


          // EXACT original camera

          camera.position.copy(
            AMETHYST_ROOM_INITIAL_CAMERA
          )


          camera.lookAt(
            AMETHYST_ROOM_FOCUS
          )


          camera.updateProjectionMatrix()


          if (
            controlsRef.current
          ) {

            controlsRef.current.target.copy(
              AMETHYST_ROOM_FOCUS
            )


            controlsRef.current.enabled =
              true


            controlsRef.current.update()

          }


          console.log(
            '📖 CAMERA RETURNED TO LIBRARY'
          )

        }

      }

    }
  )


  // ==================================================
  // 🏛️ ROOM SETUP
  // ==================================================

  useEffect(
    () => {

      scene.visible =
        true


      // ----------------------------------------------
      // MODEL
      // ----------------------------------------------

      scene.position.set(
        2.7,
        -1.1,
        0
      )


      scene.rotation.set(
        0.04,
        -0.7,
        0.07
      )


      scene.scale.set(
        1,
        1,
        1
      )


      scene.updateMatrixWorld(
        true
      )


      // ----------------------------------------------
      // CAMERA
      // ----------------------------------------------

      camera.position.set(
        AMETHYST_ROOM_INITIAL_CAMERA.x,
        AMETHYST_ROOM_INITIAL_CAMERA.y,
        AMETHYST_ROOM_INITIAL_CAMERA.z
      )


      camera.lookAt(
        AMETHYST_ROOM_FOCUS
      )


      camera.updateProjectionMatrix()


      // ----------------------------------------------
      // CONTROLS
      // ----------------------------------------------

      if (
        controlsRef.current
      ) {

        const controls =
          controlsRef.current


        controls.target.copy(
          AMETHYST_ROOM_FOCUS
        )


        controls.enableDamping =
          true


        controls.dampingFactor =
          0.15


        controls.enableRotate =
          true


        controls.enableZoom =
          true


        controls.enablePan =
          false


        controls.rotateSpeed =
          0.5


        controls.minAzimuthAngle =
          AMETHYST_ROOM_INITIAL_AZIMUTH - 0.4


        controls.maxAzimuthAngle =
          AMETHYST_ROOM_INITIAL_AZIMUTH + 0.12


        controls.minPolarAngle =
          AMETHYST_ROOM_INITIAL_POLAR - 1


        controls.maxPolarAngle =
          AMETHYST_ROOM_INITIAL_POLAR + 1.2


        controls.zoomSpeed =
          0.35


        controls.minDistance =
          1.5


        controls.maxDistance =
          3.55


        controls.update()

      }


      // ----------------------------------------------
      // MATERIALS
      // ----------------------------------------------

      scene.traverse(
        (object) => {

          if (
            object.isMesh &&
            object.material
          ) {

            object.material.side =
              THREE.DoubleSide

          }

        }
      )

    },
    [
      scene,
      camera
    ]
  )


  // ==================================================
  // 📖 BOOK CLICK
  // ==================================================

  const handleBookClick =
    (event) => {

      event.stopPropagation()


      console.log(
        '💜 CLICKED OBJECT:',
        event.object.name
      )


      if (
        event.object.name !==
        MAGIC_BOOK_NAME
      ) {

        console.log(
          '❌ Not the magic book'
        )

        return

      }


      if (
        enteringBookRef.current ||
        closingArchiveRef.current ||
        archiveOpen
      ) {

        return

      }


      console.log(
        '📖 MAGIC BOOK CLICKED!'
      )


      // ----------------------------------------------
      // BOOK WORLD POSITION
      // ----------------------------------------------

      const bookWorldPosition =
        new THREE.Vector3()


      event.object.getWorldPosition(
        bookWorldPosition
      )


      bookTarget.current.copy(
        bookWorldPosition
      )


      // ----------------------------------------------
      // SOUND
      // ----------------------------------------------

      playMagicSound()


      // ----------------------------------------------
      // START ZOOM IN
      // ----------------------------------------------

      animationStart.current.copy(
        camera.position
      )


      const direction =
        new THREE.Vector3()
          .subVectors(
            camera.position,
            bookWorldPosition
          )
          .normalize()


      animationEnd.current
        .copy(
          bookWorldPosition
        )
        .add(
          direction.multiplyScalar(
            0.25
          )
        )


      animationProgress.current =
        0


      enteringBookRef.current =
        true


      if (
        controlsRef.current
      ) {

        controlsRef.current.enabled =
          false

      }


      console.log(
        '📷 ZOOMING INTO BOOK...'
      )

    }


  // ==================================================
  // ❌ CLOSE ARCHIVE
  // ==================================================

  const closeArchive =
    () => {

      setPurpleFlash(
        false
      )


      if (
        onFlashChange
      ) {

        onFlashChange(
          false
        )

      }


      // ----------------------------------------------
      // START SMOOTH ZOOM OUT
      // ----------------------------------------------

      closingArchiveRef.current =
        true


      animationProgress.current =
        0


      animationStart.current.copy(
        camera.position
      )


      animationEnd.current.copy(
        AMETHYST_ROOM_INITIAL_CAMERA
      )


      setArchiveOpen(
        false
      )


      if (
        onArchiveOpenChange
      ) {

        onArchiveOpenChange(
          false
        )

      }


      if (
        controlsRef.current
      ) {

        controlsRef.current.enabled =
          false

      }


      console.log(
        '📷 ZOOMING OUT OF BOOK...'
      )


      if (
        onCloseArchive
      ) {

        onCloseArchive()

      }

    }


  // ==================================================
  // 📖 DEBUG ARCHIVE STATE
  // ==================================================

  useEffect(
    () => {

      console.log(
        '📖 ARCHIVE STATE:',
        archiveOpen
      )

    },
    [
      archiveOpen
    ]
  )


  // ==================================================
  // 🎨 RENDER
  // ==================================================

  return (

    <>

      {/* ==================================================
          🏛️ LIBRARY
      ================================================== */}

      <primitive
        object={scene}
        onPointerDown={
          handleBookClick
        }
      />


      {/* ==================================================
          💡 LIGHTING
      ================================================== */}

      <ambientLight
        intensity={
          0.35
        }
      />


      <hemisphereLight
        skyColor="#6D4C91"
        groundColor="#09050F"
        intensity={
          0.75
        }
      />


      <pointLight
        position={[
          0,
          5,
          0
        ]}
        intensity={
          8
        }
        distance={
          25
        }
        decay={
          2
        }
        color="#B56CFF"
      />


      <pointLight
        position={[
          -5,
          3,
          3
        ]}
        intensity={
          5
        }
        distance={
          18
        }
        decay={
          2
        }
        color="#8B5CF6"
      />


      <pointLight
        position={[
          5,
          3,
          -3
        ]}
        intensity={
          4
        }
        distance={
          18
        }
        decay={
          2
        }
        color="#D8B4FE"
      />


      {/* ==================================================
          💜 BOOK LIGHT
      ================================================== */}

      {
        enteringBookRef.current && (

          <pointLight
            position={
              bookTarget.current
            }
            intensity={
              18
            }
            distance={
              8
            }
            decay={
              2
            }
            color="#C084FC"
          />

        )
      }


      {/* ==================================================
          🎥 CONTROLS
      ================================================== */}

      <OrbitControls
        ref={
          controlsRef
        }

        enableDamping

        dampingFactor={
          0.08
        }

        enableRotate={
          !archiveOpen &&
          !enteringBookRef.current &&
          !closingArchiveRef.current
        }

        enableZoom={
          !archiveOpen &&
          !enteringBookRef.current &&
          !closingArchiveRef.current
        }

        enablePan={
          false
        }

        rotateSpeed={
          0.5
        }

        zoomSpeed={
          0.35
        }

        minDistance={
          1.5
        }

        maxDistance={
          3.55
        }

      />

    </>

  )
}


// ==================================================
// ⚡ PRELOAD
// ==================================================

useGLTF.preload(
  '/models/amethyst-library.glb'
)


export default AmethystLibraryRoom