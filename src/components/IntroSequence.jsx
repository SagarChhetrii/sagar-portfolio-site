import { useState, useEffect, useRef } from 'react'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

function SummerHouse() {
  const { scene } = useGLTF('/models/summer-house.glb')
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    scene.position.set(0, 0, 0)
    scene.rotation.set(0, 0, 0)
    scene.scale.set(1, 1, 1)
    scene.updateWorldMatrix(true, true)

    const box = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)

    scene.position.x -= center.x
    scene.position.y -= center.y
    scene.position.z -= center.z

    const maxDimension = Math.max(size.x, size.y, size.z)
    const distance = (maxDimension / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))

    camera.position.set(distance * 1.2, distance * 0.4, distance * 0.8)
    camera.lookAt(0, 0, 0)

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }

    scene.traverse((object) => {
      if (object.isMesh && object.material) {
        object.material.side = THREE.DoubleSide
      }
    })

    console.log('☀️ SUMMER HOUSE LOADED')
  }, [scene, camera])

  return (
    <>
      <primitive object={scene} />

      {/* Bright summer lighting */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 20, 10]} intensity={2} color="#fff5e6" />
      <hemisphereLight skyColor="#87CEEB" groundColor="#90EE90" intensity={1} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#FFD700" />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        enableRotate={true}
        enableZoom={true}
        enablePan={false}
        rotateSpeed={0.3}
        zoomSpeed={0.5}
      />
    </>
  )
}

function TypewriterEffect({ onComplete }) {
  const [text, setText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const fullName = 'SAGAR CHHETRI'
  const audioRef = useRef(null)

  useEffect(() => {
    let currentIndex = 0

    const typeInterval = setInterval(() => {
      if (currentIndex < fullName.length) {
        setText(fullName.substring(0, currentIndex + 1))

        // Play typing sound
        const audio = new Audio('/sounds/typewriter.mp3')
        audio.volume = 0.3
        audio.play().catch(e => console.log('Audio play failed:', e))

        currentIndex++
      } else {
        clearInterval(typeInterval)

        // Cursor blink after typing complete
        setTimeout(() => {
          const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev)
          }, 530)

          // Complete after 2 seconds
          setTimeout(() => {
            clearInterval(cursorInterval)
            if (onComplete) onComplete()
          }, 2000)
        }, 500)
      }
    }, 150)

    return () => clearInterval(typeInterval)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        zIndex: 1000,
        fontFamily: "'Courier New', monospace",
        color: '#00ff00',
        userSelect: 'none',
      }}
    >
      <div style={{
        fontSize: 'clamp(32px, 8vw, 80px)',
        fontWeight: 'bold',
        letterSpacing: '8px',
        textShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
      }}>
        {text}
        {showCursor && <span style={{ opacity: showCursor ? 1 : 0 }}>_</span>}
      </div>

      <div style={{
        marginTop: '20px',
        fontSize: 'clamp(12px, 2vw, 18px)',
        letterSpacing: '4px',
        opacity: text === fullName ? 0.7 : 0,
        transition: 'opacity 1s ease',
      }}>
        PORTFOLIO EXPERIENCE
      </div>
    </div>
  )
}

function ThunderEffect({ onComplete }) {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    // Thunder sound
    const thunder = new Audio('/sounds/thunder.mp3')
    thunder.volume = 0.6
    thunder.play().catch(e => console.log('Thunder sound failed:', e))

    // Flash effect
    setFlash(true)
    setTimeout(() => setFlash(false), 150)

    setTimeout(() => {
      setFlash(true)
      setTimeout(() => setFlash(false), 100)
    }, 300)

    // Complete transition
    setTimeout(() => {
      if (onComplete) onComplete()
    }, 1500)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: flash ? '#fff' : '#000',
        transition: 'background 0.1s ease',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    />
  )
}

function FogTransition({ progress }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(circle, rgba(20,20,30,${progress}) 0%, rgba(0,0,0,${progress}) 100%)`,
        pointerEvents: 'none',
        zIndex: 100,
        transition: 'all 2s ease',
      }}
    />
  )
}

function IntroSequence({ onIntroComplete }) {
  const [stage, setStage] = useState('summer') // summer, fog, typewriter, thunder, complete

  useEffect(() => {
    // Show summer scene for 3 seconds
    const summerTimer = setTimeout(() => {
      setStage('fog')
    }, 3000)

    return () => clearTimeout(summerTimer)
  }, [])

  useEffect(() => {
    if (stage === 'fog') {
      // Fog builds for 3 seconds
      const fogTimer = setTimeout(() => {
        setStage('typewriter')
      }, 3000)
      return () => clearTimeout(fogTimer)
    }
  }, [stage])

  const handleTypewriterComplete = () => {
    setStage('thunder')
  }

  const handleThunderComplete = () => {
    setStage('complete')
    if (onIntroComplete) onIntroComplete()
  }

  return (
    <>
      {/* Fog overlay during summer scene */}
      {stage === 'fog' && <FogTransition progress={1} />}

      {/* Typewriter effect */}
      {stage === 'typewriter' && (
        <TypewriterEffect onComplete={handleTypewriterComplete} />
      )}

      {/* Thunder effect */}
      {stage === 'thunder' && (
        <ThunderEffect onComplete={handleThunderComplete} />
      )}

      {/* Fade out after thunder */}
      {stage === 'complete' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 1000,
            opacity: 1,
            animation: 'fadeOut 2s ease forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </>
  )
}

export { SummerHouse, IntroSequence }
