import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { elasticAudio } from '../../utils/elasticAudio'

export interface ElasticCharacterProps {
  imageSrc?: string
  className?: string
  onInteractionStart?: () => void
}

export const ElasticCharacter: React.FC<ElasticCharacterProps> = ({
  imageSrc = '/raman-hero.png',
  className = '',
  onInteractionStart,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId: number
    let renderer: THREE.WebGLRenderer
    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>
    let basePositions: Float32Array
    let vertexWeights: Float32Array

    // Spring physics state
    let isDragging = false
    let isSpringActive = false
    let isHovering = false
    const grabPoint = new THREE.Vector3()
    const grabPlane = new THREE.Plane()
    const dragOffset = new THREE.Vector3()
    const dragVelocity = new THREE.Vector3()

    // Mouse velocity tracking for audio reactivity
    const lastMousePos = new THREE.Vector2(0, 0)
    let mouseVelocity = 0

    // Spring physics parameters tuned for soft-body rubber elasticity
    const STIFFNESS = 160.0
    const DAMPING = 11.5
    const MAX_DRAG_DISTANCE = 3.2
    const INFLUENCE_RADIUS = 1.35

    // Subtle head & eye cursor tracking
    const targetRotation = new THREE.Vector2(0, 0)
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(-999, -999)

    // 1. Scene, Camera & WebGL Renderer setup
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 4.2

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // 2. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3)
    keyLight.position.set(2.5, 3.5, 4.5)
    scene.add(keyLight)

    const purpleRim = new THREE.PointLight(0xb829e6, 3.5, 10)
    purpleRim.position.set(-2.8, 1.5, 1.5)
    scene.add(purpleRim)

    const bottomGlow = new THREE.PointLight(0xec4899, 2.0, 8)
    bottomGlow.position.set(0, -2.5, 2.5)
    scene.add(bottomGlow)

    // 3. Load Character Texture and Build Dense 3D Organic Curved Mesh
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      imageSrc,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.generateMipmaps = true
        texture.minFilter = THREE.LinearMipmapLinearFilter

        const imgAspect = texture.image.width / texture.image.height
        const planeHeight = 2.45
        const planeWidth = planeHeight * imgAspect

        // High-density grid (120x120) for continuous organic rubber deformation
        const segmentsX = 120
        const segmentsY = 120
        const geometry = new THREE.PlaneGeometry(
          planeWidth,
          planeHeight,
          segmentsX,
          segmentsY
        )

        const posAttr = geometry.attributes.position
        const vertexCount = posAttr.count
        basePositions = new Float32Array(vertexCount * 3)
        vertexWeights = new Float32Array(vertexCount)

        for (let i = 0; i < vertexCount; i++) {
          const vx = posAttr.getX(i)
          const vy = posAttr.getY(i)

          // 3D dome curvature: head bulges naturally forward in 3D
          const normalizedDist = Math.hypot(
            vx / (planeWidth * 0.5),
            vy / (planeHeight * 0.5)
          )
          const zDepth = Math.max(0, Math.cos(Math.min(normalizedDist, 1) * (Math.PI / 2))) * 0.38
          posAttr.setZ(i, zDepth)

          basePositions[i * 3] = vx
          basePositions[i * 3 + 1] = vy
          basePositions[i * 3 + 2] = zDepth
        }

        geometry.computeVertexNormals()

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.04,
          roughness: 0.4,
          metalness: 0.08,
          side: THREE.DoubleSide,
        })

        mesh = new THREE.Mesh(geometry, material)
        // Positioned lower at y = -0.42 so there is a clean gap between the heading and the top of the hair
        mesh.position.set(0, -0.42, 0)
        scene.add(mesh)
        setIsLoading(false)
      },
      undefined,
      (err) => {
        console.error('Error loading elastic character texture:', err)
        setIsLoading(false)
      }
    )

    // 4. Raycasting & Drag Handlers
    const updatePointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const newX = ((clientX - rect.left) / rect.width) * 2 - 1
      const newY = -((clientY - rect.top) / rect.height) * 2 + 1

      const dX = newX - lastMousePos.x
      const dY = newY - lastMousePos.y
      mouseVelocity = Math.min(1.0, Math.hypot(dX, dY) * 15.0)
      lastMousePos.set(newX, newY)

      pointer.x = newX
      pointer.y = newY
    }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!mesh) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      updatePointer(clientX, clientY)

      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObject(mesh)

      if (intersects.length > 0) {
        if ('touches' in e) {
          e.preventDefault()
        }

        isDragging = true
        isSpringActive = false
        dragVelocity.set(0, 0, 0)
        dragOffset.set(0, 0, 0)

        // Audio trigger
        elasticAudio.playGrab()
        if (onInteractionStart) onInteractionStart()

        // Grab point in 3D world space
        grabPoint.copy(intersects[0].point)

        // Drag plane parallel to camera
        const cameraDir = new THREE.Vector3()
        camera.getWorldDirection(cameraDir)
        grabPlane.setFromNormalAndCoplanarPoint(cameraDir.negate(), grabPoint)

        // Calculate smooth Gaussian influence field weights
        const count = mesh.geometry.attributes.position.count
        const grabLocal = mesh.worldToLocal(grabPoint.clone())

        for (let i = 0; i < count; i++) {
          const bx = basePositions[i * 3]
          const by = basePositions[i * 3 + 1]
          const bz = basePositions[i * 3 + 2]

          const dist = Math.hypot(bx - grabLocal.x, by - grabLocal.y, bz - grabLocal.z)
          if (dist < INFLUENCE_RADIUS) {
            const normDist = dist / INFLUENCE_RADIUS
            const gaussian = Math.exp(-Math.pow(normDist * 2.0, 2))
            const smooth = Math.pow(1 - normDist * normDist, 2)
            vertexWeights[i] = gaussian * smooth
          } else {
            vertexWeights[i] = 0
          }
        }

        container.style.cursor = 'grabbing'
      }
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      updatePointer(clientX, clientY)

      if (isDragging && mesh) {
        if ('touches' in e) {
          e.preventDefault()
        }

        raycaster.setFromCamera(pointer, camera)
        const currentWorldPos = new THREE.Vector3()
        raycaster.ray.intersectPlane(grabPlane, currentWorldPos)

        if (currentWorldPos) {
          const worldDelta = currentWorldPos.sub(grabPoint)
          const rawDist = worldDelta.length()

          // Progressive non-linear rubber resistance
          const ratio = Math.min(rawDist / MAX_DRAG_DISTANCE, 0.999)
          const elasticScale = Math.tanh(ratio * 2.0) * (MAX_DRAG_DISTANCE * 0.5)

          if (rawDist > 0.0001) {
            worldDelta.multiplyScalar(elasticScale / rawDist)
          }

          // Convert to local coordinates
          const localDelta = worldDelta.applyEuler(
            new THREE.Euler(-mesh.rotation.x, -mesh.rotation.y, -mesh.rotation.z)
          )

          dragOffset.copy(localDelta)

          // Dynamic Audio Reactivity
          const stretchNorm = Math.min(1.0, dragOffset.length() / (MAX_DRAG_DISTANCE * 0.5))
          elasticAudio.updateStretch(stretchNorm, mouseVelocity)
        }
      } else if (mesh) {
        // Hover cursor detection
        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObject(mesh)
        if (intersects.length > 0) {
          if (!isHovering) {
            isHovering = true
            container.style.cursor = 'grab'
          }
        } else if (isHovering) {
          isHovering = false
          container.style.cursor = 'default'
        }

        // Smooth eye and head tracking when hovering
        targetRotation.y = pointer.x * 0.14
        targetRotation.x = -pointer.y * 0.12
      }
    }

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false
        isSpringActive = true
        container.style.cursor = isHovering ? 'grab' : 'default'

        // Snap-back audio feedback
        const intensity = Math.min(1.0, dragOffset.length() / (MAX_DRAG_DISTANCE * 0.4))
        elasticAudio.playSnapBack(intensity)
      }
    }

    // Event listeners
    const canvas = renderer.domElement
    canvas.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove, { passive: false })
    window.addEventListener('mouseup', onPointerUp)

    canvas.addEventListener('touchstart', onPointerDown, { passive: false })
    window.addEventListener('touchmove', onPointerMove, { passive: false })
    window.addEventListener('touchend', onPointerUp)

    // 5. Animation & Spring Simulation Loop
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate)

      const dt = Math.min((currentTime - lastTime) / 1000, 0.033)
      lastTime = currentTime
      const elapsed = currentTime * 0.001

      if (!mesh) {
        renderer.render(scene, camera)
        return
      }

      // Subtle alive idle breathing animation when not dragged
      const idleFloatY = isDragging ? 0 : Math.sin(elapsed * 1.6) * 0.02
      const idleFloatZ = isDragging ? 0 : Math.cos(elapsed * 1.2) * 0.015
      mesh.position.y = -0.42 + idleFloatY

      // Head / Eye Cursor Orientation Tracking
      mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * 0.09
      mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * 0.09

      // Spring Physics Simulation
      if (isSpringActive) {
        const force = dragOffset.clone().multiplyScalar(-STIFFNESS)
        const dampingForce = dragVelocity.clone().multiplyScalar(DAMPING)
        const acceleration = force.sub(dampingForce)

        dragVelocity.addScaledVector(acceleration, dt)
        dragOffset.addScaledVector(dragVelocity, dt)

        // Check if settled
        if (dragOffset.length() < 0.001 && dragVelocity.length() < 0.008) {
          dragOffset.set(0, 0, 0)
          dragVelocity.set(0, 0, 0)
          isSpringActive = false
        }
      }

      // Deform mesh if dragging or spring physics is active
      if (isDragging || isSpringActive || dragOffset.lengthSq() > 0.00001) {
        const posAttr = mesh.geometry.attributes.position
        const count = posAttr.count
        const dx = dragOffset.x
        const dy = dragOffset.y
        const dz = dragOffset.z + Math.hypot(dx, dy) * 0.28 + idleFloatZ

        for (let i = 0; i < count; i++) {
          const w = vertexWeights[i]
          if (w > 0.0001) {
            posAttr.setXYZ(
              i,
              basePositions[i * 3] + dx * w,
              basePositions[i * 3 + 1] + dy * w,
              basePositions[i * 3 + 2] + dz * w
            )
          } else {
            const bx = basePositions[i * 3]
            const by = basePositions[i * 3 + 1]
            const oppDist = Math.hypot(bx + grabPoint.x * 0.45, by + grabPoint.y * 0.45)
            const oppWeight = Math.max(0, 1 - oppDist / INFLUENCE_RADIUS) * 0.14

            posAttr.setXYZ(
              i,
              bx - dx * oppWeight * 0.25,
              by - dy * oppWeight * 0.25,
              basePositions[i * 3 + 2]
            )
          }
        }

        posAttr.needsUpdate = true
        mesh.geometry.computeVertexNormals()
      }

      renderer.render(scene, camera)
    }

    animate(performance.now())

    // 6. Resize handling
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      canvas.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [imageSrc, onInteractionStart])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
