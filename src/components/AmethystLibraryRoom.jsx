import { useEffect, useRef } from 'react'
import {
  useGLTF,
  OrbitControls
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'


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


function AmethystLibraryRoom({
  onExit
}) {
  const { scene } =
    useGLTF(
      '/models/amethyst-library.glb'
    )


  const { camera } =
    useThree()


  const controlsRef =
    useRef()


  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia(
      '(max-width: 700px)'
    ).matches


  useEffect(() => {
    scene.visible = true


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


    camera.position.set(
      AMETHYST_ROOM_INITIAL_CAMERA.x,
      AMETHYST_ROOM_INITIAL_CAMERA.y,
      AMETHYST_ROOM_INITIAL_CAMERA.z
    )


    camera.lookAt(
      AMETHYST_ROOM_FOCUS
    )
    camera.updateProjectionMatrix()


    if (
      controlsRef.current
    ) {
      const controls =
        controlsRef.current

      const azimuth =
        controls.getAzimuthalAngle()

      const polar =
        controls.getPolarAngle()


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
        isMobile
          ? 0.6
          : 0.5
      controls.minAzimuthAngle =
        AMETHYST_ROOM_INITIAL_AZIMUTH - 0.4
      controls.maxAzimuthAngle =
        AMETHYST_ROOM_INITIAL_AZIMUTH + 0.12
      controls.minPolarAngle =
        AMETHYST_ROOM_INITIAL_POLAR - 1
      controls.maxPolarAngle =
        AMETHYST_ROOM_INITIAL_POLAR + 1.2
      controls.zoomSpeed =
        isMobile
          ? 0.45
          : 0.35
      controls.minDistance =
        1.5
      controls.maxDistance =
        3.55
      controls.update()
    }


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
  }, [
    scene,
    camera,
    isMobile
  ])


  return (
    <>
      <primitive
        object={scene}
      />


      <ambientLight
        intensity={0.35}
      />


      <hemisphereLight
        skyColor="#6D4C91"
        groundColor="#09050F"
        intensity={0.75}
      />


      <pointLight
        position={[
          0,
          5,
          0
        ]}
        intensity={8}
        distance={25}
        decay={2}
        color="#B56CFF"
      />


      <pointLight
        position={[
          -5,
          3,
          3
        ]}
        intensity={5}
        distance={18}
        decay={2}
        color="#8B5CF6"
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
        color="#D8B4FE"
      />


      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        enableRotate={true}
        enableZoom={true}
        enablePan={false}
        zoomSpeed={
          isMobile
            ? 0.45
            : 0.35
        }
        minDistance={1.5}
        maxDistance={3.55}
      />
      
    </>
  )
}


useGLTF.preload(
  '/models/amethyst-library.glb'
)


export default AmethystLibraryRoom