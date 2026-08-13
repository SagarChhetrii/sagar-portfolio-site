import { useEffect, useRef } from 'react'
import {
  useGLTF,
  OrbitControls
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'



function SchoolRoom({
  onExit
}) {

  const { scene } =
    useGLTF(
      '/models/school-room.glb'
    )


  const { camera } =
    useThree()


  const controlsRef =
    useRef()


  useEffect(() => {

    // ==========================================
    // 🏫 MODEL
    // ==========================================

    scene.visible = true

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

    scene.scale.set(
      1,
      1,
      1
    )

    scene.updateMatrixWorld(
      true
    )


    // ==========================================
    // 📦 MODEL SIZE
    // ==========================================

    const box =
      new THREE.Box3()
        .setFromObject(scene)

    const size =
      new THREE.Vector3()

    box.getSize(size)

    console.log(
      '🏫 SCHOOL ROOM SIZE:',
      size.x,
      size.y,
      size.z
    )


    // ==========================================
    // 📷 TEMPORARY CAMERA
    // ==========================================

    camera.position.set(
      0,
      2,
      8
    )

    camera.lookAt(
      0,
      1,
      0
    )

    camera.updateProjectionMatrix()


    // ==========================================
    // 🎥 CONTROLS
    // ==========================================

    if (
      controlsRef.current
    ) {

      const controls =
        controlsRef.current

      controls.target.set(
        0,
        1,
        0
      )

      controls.enableDamping =
        true

      controls.dampingFactor =
        0.08

      controls.enableRotate =
        true

      controls.enableZoom =
        true

      controls.enablePan =
        false

      controls.rotateSpeed =
        0.25

      controls.zoomSpeed =
        0.35

      controls.minDistance =
        1

      controls.maxDistance =
        10

      controls.update()

    }


    // ==========================================
    // 💡 MATERIALS
    // ==========================================

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
    camera
  ])


  return (

    <>

      <primitive
        object={scene}
      />


      {/* ========================================
          💡 LIGHTING
      ======================================== */}

      <ambientLight
        intensity={0.5}
      />


      <hemisphereLight
        skyColor="#B8D8FF"
        groundColor="#101522"
        intensity={0.8}
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


      <OrbitControls
        ref={controlsRef}

        enableDamping

        dampingFactor={0.08}

        enableRotate={true}

        enableZoom={true}

        enablePan={false}

        rotateSpeed={0.25}

        zoomSpeed={0.35}

        minDistance={1}

        maxDistance={10}
      />

    </>

  )
}


useGLTF.preload(
  '/models/school-room.glb'
)

export default SchoolRoom