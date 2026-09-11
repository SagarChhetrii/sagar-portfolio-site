import { useEffect, useRef } from 'react'
import {
  useGLTF,
  OrbitControls
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'


// ==========================================
// 🏫 FINAL SCHOOL ROOM VALUES
// ==========================================

const SCHOOL_MODEL_POSITION = [
  -7.6,
  -1.5,
  -20
]

const SCHOOL_MODEL_ROTATION = [
  0.04,
  0.05,
  0
]

const SCHOOL_MODEL_SCALE = [
  1,
  1,
  1
]


// ==========================================
// 📷 FINAL CAMERA VALUES
// ==========================================

const SCHOOL_CAMERA_POSITION = [
  6.1,
  -2.0,
  40
]

const SCHOOL_CAMERA_TARGET = [
  -8.9,
  0.2,
  -26
]


// ==========================================
// 🎥 FINAL MOVEMENT VALUES
// ==========================================

const SCHOOL_DAMPING =
  0.12

const SCHOOL_ROTATE_SPEED =
  0.25

const SCHOOL_ZOOM_SPEED =
  0.35

const SCHOOL_MIN_DISTANCE =
  5

const SCHOOL_MAX_DISTANCE =
  10


function SchoolRoom({
  onExit
}) {

  // ==========================================
  // 🏫 LOAD MODEL
  // ==========================================

  const {
    scene
  } = useGLTF(
    '/models/school-room.glb'
  )


  // ==========================================
  // 📷 CAMERA
  // ==========================================

  const {
    camera
  } = useThree()


  const controlsRef =
    useRef()


  // ==========================================
  // 🏫 APPLY MODEL + CAMERA
  // ==========================================

  useEffect(() => {

    console.log(
      '🏫 SCHOOL ROOM LOADED'
    )


    // ========================================
    // MODEL POSITION
    // ========================================

    scene.visible = true

    scene.position.set(
      SCHOOL_MODEL_POSITION[0],
      SCHOOL_MODEL_POSITION[1],
      SCHOOL_MODEL_POSITION[2]
    )


    // ========================================
    // MODEL ROTATION
    // ========================================

    scene.rotation.set(
      SCHOOL_MODEL_ROTATION[0],
      SCHOOL_MODEL_ROTATION[1],
      SCHOOL_MODEL_ROTATION[2]
    )


    // ========================================
    // MODEL SCALE
    // ========================================

    scene.scale.set(
      SCHOOL_MODEL_SCALE[0],
      SCHOOL_MODEL_SCALE[1],
      SCHOOL_MODEL_SCALE[2]
    )


    scene.updateMatrixWorld(
      true
    )


    // ========================================
    // MATERIALS
    // ========================================

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


    // ========================================
    // 📷 CAMERA POSITION
    // ========================================

    camera.position.set(
      SCHOOL_CAMERA_POSITION[0],
      SCHOOL_CAMERA_POSITION[1],
      SCHOOL_CAMERA_POSITION[2]
    )


    // ========================================
    // 👀 CAMERA TARGET
    // ========================================

    const target =
      new THREE.Vector3(
        SCHOOL_CAMERA_TARGET[0],
        SCHOOL_CAMERA_TARGET[1],
        SCHOOL_CAMERA_TARGET[2]
      )


    camera.lookAt(
      target
    )


    camera.updateProjectionMatrix()


    // ========================================
    // 🎥 ORBIT CONTROLS
    // ========================================

    if (
      controlsRef.current
    ) {

      const controls =
        controlsRef.current


      controls.target.copy(
        target
      )
      // ========================================
      // ↔️ SMALL LEFT / RIGHT ROTATION
      // ========================================

      const startAzimuth =
        Math.atan2(
          camera.position.x - target.x,
          camera.position.z - target.z
        )

      const rotationLimit = 0.15

      controls.minAzimuthAngle =
        startAzimuth

      controls.maxAzimuthAngle =
        startAzimuth

      // ========================================
      // 🚫 NO UP / DOWN ROTATION
      // ========================================

      const distance =
        camera.position.distanceTo(target)

      const startPolar =
        Math.acos(
          THREE.MathUtils.clamp(
            (camera.position.y - target.y) /
              distance,
            -1,
            1
          )
        )

      controls.minPolarAngle =
        startPolar

      controls.maxPolarAngle =
        startPolar  


      controls.enableDamping =
        false

      controls.dampingFactor =
        SCHOOL_DAMPING


      controls.enableRotate =
        false

      controls.enableZoom =
        true

      controls.enablePan =
        false


      controls.rotateSpeed =
        SCHOOL_ROTATE_SPEED

      controls.zoomSpeed =
        SCHOOL_ZOOM_SPEED


      controls.minDistance =
        SCHOOL_MIN_DISTANCE

      controls.maxDistance =
        SCHOOL_MAX_DISTANCE


      controls.update()
      controls.saveState()

    }


    // ========================================
    // 📦 DEBUG
    // ========================================

    const box =
      new THREE.Box3()
        .setFromObject(scene)


    const size =
      new THREE.Vector3()


    box.getSize(
      size
    )


    console.log(
      '🏫 SCHOOL ROOM SIZE:',
      size.x,
      size.y,
      size.z
    )


    console.log(
      '🏫 SCHOOL ROOM POSITION:',
      scene.position.x,
      scene.position.y,
      scene.position.z
    )


    console.log(
      '📷 SCHOOL CAMERA:',
      camera.position.x,
      camera.position.y,
      camera.position.z
    )


  }, [
    scene,
    camera
  ])


  // ==========================================
  // 🎨 RENDER
  // ==========================================
  // ==========================================
  // ↔️ UNLOCK SMALL ROTATION AFTER ZOOM
  // ==========================================

  useEffect(() => {

    const controls =
      controlsRef.current

    if (!controls) return

    const target =
      new THREE.Vector3(
        SCHOOL_CAMERA_TARGET[0],
        SCHOOL_CAMERA_TARGET[1],
        SCHOOL_CAMERA_TARGET[2]
      )

    const startingCamera =
      new THREE.Vector3(
        SCHOOL_CAMERA_POSITION[0],
        SCHOOL_CAMERA_POSITION[1],
        SCHOOL_CAMERA_POSITION[2]
      )

    const startingDistance =
      startingCamera.distanceTo(
        target
      )

    const rotationLimit =
      0.20


    const handleChange = () => {

      const currentDistance =
        camera.position.distanceTo(
          target
        )


      // ======================================
      // 🔒 AT INITIAL POSITION
      // ======================================

      if (
        currentDistance >=
        startingDistance - 0.5
      ) {

        const currentAzimuth =
          Math.atan2(
            camera.position.x -
              target.x,

            camera.position.z -
              target.z
          )

        controls.minAzimuthAngle =
          currentAzimuth

        controls.maxAzimuthAngle =
          currentAzimuth

      }


      // ======================================
      // 🔓 AFTER ZOOMING IN
      // ======================================

      else {

        const currentAzimuth =
          Math.atan2(
            camera.position.x -
              target.x,

            camera.position.z -
              target.z
          )

        controls.minAzimuthAngle =
          currentAzimuth -
          rotationLimit

        controls.maxAzimuthAngle =
          currentAzimuth +
          rotationLimit

      }

    }


    controls.addEventListener(
      'change',
      handleChange
    )


    return () => {

      controls.removeEventListener(
        'change',
        handleChange
      )

    }

  }, [
    camera
  ])
  return (

    <>

      {/* ========================================
          🏫 SCHOOL ROOM
      ======================================== */}

      <primitive
        object={scene}
      />


      {/* ========================================
          💡 LIGHTING
      ======================================== */}

      <ambientLight
        intensity={0.2}
      />


      <hemisphereLight
        skyColor="#B8D8FF"
        groundColor="#101522"
        intensity={0.4}
      />


      <pointLight
        position={[
          0,
          5,
          0
        ]}
        intensity={4}
        distance={25}
        decay={2}
      />


      <pointLight
        position={[
          -5,
          3,
          3
        ]}
        intensity={4}
        distance={18}
        decay={2}
      />


      <pointLight
        position={[
          5,
          3,
          -3
        ]}
        intensity={4}
        distance={18}
        decay={2}
      />


      {/* ========================================
          🎥 ORBIT CONTROLS
      ======================================== */}

      <OrbitControls
        ref={controlsRef}

        enableDamping={false}

        enableRotate={false}

        enableZoom={true}

        enablePan={false}

        zoomSpeed={0.1}

        minDistance={65}
        maxDistance={67.69}

        target={SCHOOL_CAMERA_TARGET}
      />
      
      

    </>

  )
}


// ==========================================
// ⚡ PRELOAD
// ==========================================

useGLTF.preload(
  '/models/school-room.glb'
)


export default SchoolRoom