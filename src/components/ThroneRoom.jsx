import { useEffect, useRef } from 'react'
import {
  useGLTF,
  OrbitControls
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'


function ThroneRoom({
  onExit
}) {

  // ==================================================
  // 👑 LOAD THRONE ROOM
  // ==================================================

  const {
    scene
  } = useGLTF(
    '/models/throne-room.glb'
  )


  // ==================================================
  // 📷 CAMERA
  // ==================================================

  const {
    camera
  } = useThree()


  const controlsRef =
    useRef()


  // ==================================================
  // 👑 FIXED THRONE ROOM POSITION
  // ==================================================

  const MODEL_POSITION = [
    0,
    -2.9,
    0
  ]

  const MODEL_ROTATION = [
    0,
    0,
    0
  ]

  const MODEL_SCALE = 2.97


  // ==================================================
  // 📷 FIXED OPENING CAMERA
  // ==================================================

  const CAMERA_POSITION = [
    0.6,
    2.4,
    10
  ]


  // ==================================================
  // 👀 FIXED CAMERA TARGET
  // ==================================================

  const CAMERA_TARGET = [
    1,
    1.7,
    -4.7
  ]


  // ==================================================
  // 💡 LIGHT
  // ==================================================

  const LIGHT_INTENSITY = 5


  // ==================================================
  // 🏰 APPLY ROOM + CAMERA
  // ==================================================

  useEffect(() => {

    // ==================================================
    // MODEL
    // ==================================================

    scene.visible = true


    scene.position.set(
      MODEL_POSITION[0],
      MODEL_POSITION[1],
      MODEL_POSITION[2]
    )


    scene.rotation.set(
      MODEL_ROTATION[0],
      MODEL_ROTATION[1],
      MODEL_ROTATION[2]
    )


    scene.scale.set(
      MODEL_SCALE,
      MODEL_SCALE,
      MODEL_SCALE
    )


    scene.updateMatrixWorld(
      true
    )


    // ==================================================
    // MATERIALS
    // ==================================================

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


    // ==================================================
    // CAMERA
    // ==================================================

    camera.position.set(
      CAMERA_POSITION[0],
      CAMERA_POSITION[1],
      CAMERA_POSITION[2]
    )


    const target =
      new THREE.Vector3(
        CAMERA_TARGET[0],
        CAMERA_TARGET[1],
        CAMERA_TARGET[2]
      )


    camera.lookAt(
      target
    )


    camera.updateProjectionMatrix()


    // ==================================================
    // 🎥 ORBIT CONTROLS
    // ==================================================

    if (
      controlsRef.current
    ) {

      const controls =
        controlsRef.current


      controls.target.copy(
        target
      )


      // ==================================================
      // 🎥 BASIC MOVEMENT
      // ==================================================

      controls.enableDamping =
        true

      controls.dampingFactor =
        0.08


      // ==================================================
      // 🔄 ROTATION
      // ==================================================

      controls.enableRotate =
        true

      controls.rotateSpeed =
        0.20


      // Allow rotation around the enclosed room

      controls.minAzimuthAngle =
        -Infinity

      controls.maxAzimuthAngle =
        Infinity


      // Allow looking up/down

      controls.minPolarAngle =
        0

      controls.maxPolarAngle =
        Math.PI


      // ==================================================
      // 🔍 ZOOM
      // ==================================================

      controls.enableZoom =
        true

      controls.zoomSpeed =
        0.12


      /*
        Smaller minDistance =
        more zoom in.

        Increase this number
        if you want less zoom.
      */

      controls.minDistance =
        15


      /*
        Maximum distance.

        This prevents zooming
        too far away from the room.
      */

      controls.maxDistance =
        25


      // ==================================================
      // 🚫 NO PAN
      // ==================================================

      controls.enablePan =
        false


      controls.update()

    }


    // ==================================================
    // 📦 DEBUG
    // ==================================================

    const box =
      new THREE.Box3()
        .setFromObject(scene)


    const size =
      new THREE.Vector3()


    box.getSize(
      size
    )


    const center =
      box.getCenter(
        new THREE.Vector3()
      )


    console.log(
      '👑 THRONE ROOM SIZE:',
      size.x,
      size.y,
      size.z
    )


    console.log(
      '👑 THRONE CENTER:',
      center.x,
      center.y,
      center.z
    )


    console.log(
      '👑 MODEL POSITION:',
      MODEL_POSITION
    )


    console.log(
      '👑 MODEL SCALE:',
      MODEL_SCALE
    )


    console.log(
      '📷 CAMERA POSITION:',
      CAMERA_POSITION
    )


    console.log(
      '👀 CAMERA TARGET:',
      CAMERA_TARGET
    )


  }, [
    scene,
    camera
  ])


  // ==================================================
  // 🎨 RENDER
  // ==================================================

  return (

    <>


      {/* ==================================================
          👑 THRONE ROOM MODEL
      ================================================== */}

      <primitive
        object={scene}
      />


      {/* ==================================================
          🧱 LEFT WALL
      ================================================== */}

      <mesh
        position={[
          -32,
          3,
          -5
        ]}
      >

        <boxGeometry
          args={[
            0.5,
            20,
            70
          ]}
        />

        <meshStandardMaterial
          color="#090B10"
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />

      </mesh>


      {/* ==================================================
          🧱 RIGHT WALL
      ================================================== */}

      <mesh
        position={[
          32,
          3,
          -5
        ]}
      >

        <boxGeometry
          args={[
            0.5,
            20,
            70
          ]}
        />

        <meshStandardMaterial
          color="#090B10"
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />

      </mesh>


      {/* ==================================================
          🧱 BACK WALL
      ================================================== */}

      <mesh
        position={[
          0,
          3,
          -40
        ]}
      >

        <boxGeometry
          args={[
            65,
            20,
            0.5
          ]}
        />

        <meshStandardMaterial
          color="#090B10"
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />

      </mesh>


      {/* ==================================================
          🧱 FRONT WALL
      ================================================== */}

      <mesh
        position={[
          0,
          3,
          30
        ]}
      >

        <boxGeometry
          args={[
            65,
            20,
            0.5
          ]}
        />

        <meshStandardMaterial
          color="#090B10"
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />

      </mesh>


      {/* ==================================================
          🏛️ CEILING
      ================================================== */}

      <mesh
        position={[
          0,
          13,
          -5
        ]}
      >

        <boxGeometry
          args={[
            65,
            0.5,
            70
          ]}
        />

        <meshStandardMaterial
          color="#07090D"
          roughness={0.95}
          metalness={0.05}
          side={THREE.DoubleSide}
        />

      </mesh>


      {/* ==================================================
          💡 AMBIENT LIGHT
      ================================================== */}

      <ambientLight
        intensity={0.5}
      />


      {/* ==================================================
          💡 HEMISPHERE LIGHT
      ================================================== */}

      <hemisphereLight
        skyColor="#B8D8FF"
        groundColor="#101522"
        intensity={0.8}
      />


      {/* ==================================================
          💡 MAIN LIGHT
      ================================================== */}

      <pointLight
        position={[
          0,
          7,
          0
        ]}
        intensity={
          LIGHT_INTENSITY
        }
        distance={35}
        decay={2}
      />


      {/* ==================================================
          🔴 THRONE LIGHT
      ================================================== */}

      <pointLight
        position={[
          0,
          4,
          -8
        ]}
        intensity={10}
        distance={25}
        decay={2}
        color="#ff3333"
      />


      {/* ==================================================
          🎥 ORBIT CONTROLS
      ================================================== */}

      <OrbitControls
        ref={controlsRef}

        enableDamping={true}
        dampingFactor={0.08}

        enableRotate={true}
        enableZoom={true}
        enablePan={false}

        rotateSpeed={0.20}
        zoomSpeed={0.12}

        minDistance={15}
        maxDistance={25}
      />


    </>

  )
}


// ==================================================
// ⚡ PRELOAD
// ==================================================

useGLTF.preload(
  '/models/throne-room.glb'
)


export default ThroneRoom