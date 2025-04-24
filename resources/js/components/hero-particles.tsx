import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroParticlesProps {
  color?: string;
  hoverColor?: string;
  particleCount?: number;
  particleSize?: number;
  connectionDistance?: number;
  className?: string;
}

export default function HeroParticles({
  color = '#FFFFFF',
  hoverColor = '#00f0ff',
  particleCount = 180,
  particleSize = 0.4,
  connectionDistance = 150,
  className = '',
}: HeroParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const linesMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Transparent background
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Set renderer DOM element to fill the container
    const rendererDom = renderer.domElement;
    rendererDom.style.position = 'absolute';
    rendererDom.style.top = '0';
    rendererDom.style.left = '0';
    rendererDom.style.width = '100%';
    rendererDom.style.height = '100%';
    
    containerRef.current.appendChild(rendererDom);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount3 = particleCount * 3; // Each vertex has x, y, z
    const positions = new Float32Array(particleCount3);
    const velocities = new Float32Array(particleCount3);
    const colors = new Float32Array(particleCount3);
    const sizes = new Float32Array(particleCount);
    
    const baseColor = new THREE.Color(color);
    const hoverCol = new THREE.Color(hoverColor);
    
    // Create DNA-like double helix pattern
    const helixRadius = 20;
    const helixHeight = 40;
    const helixTurns = 2;
    const particlesPerStrand = particleCount / 2;
    
    for (let i = 0; i < particleCount3; i += 3) {
      const particleIndex = i / 3;
      const isSecondStrand = particleIndex >= particlesPerStrand;
      const strandIndex = isSecondStrand ? particleIndex - particlesPerStrand : particleIndex;
      const strandProgress = strandIndex / particlesPerStrand;
      
      // Position along helix
      const heightPosition = (strandProgress * helixHeight) - (helixHeight / 2);
      const angle = strandProgress * Math.PI * 2 * helixTurns;
      // Second strand is offset by half a turn
      const strandOffset = isSecondStrand ? Math.PI : 0;
      
      // Create double helix pattern
      positions[i] = Math.cos(angle + strandOffset) * helixRadius; // x
      positions[i + 1] = heightPosition; // y
      positions[i + 2] = Math.sin(angle + strandOffset) * helixRadius; // z
      
      // Add some randomness for more natural look
      positions[i] += (Math.random() - 0.5) * 5;
      positions[i + 1] += (Math.random() - 0.5) * 5;
      positions[i + 2] += (Math.random() - 0.5) * 5;
      
      // Velocity - very slow movement
      velocities[i] = (Math.random() - 0.5) * 0.01; // x velocity
      velocities[i + 1] = (Math.random() - 0.5) * 0.01; // y velocity
      velocities[i + 2] = (Math.random() - 0.5) * 0.01; // z velocity
      
      // Color
      colors[i] = baseColor.r;
      colors[i + 1] = baseColor.g;
      colors[i + 2] = baseColor.b;
      
      // Size - varied sizes for depth effect
      sizes[i/3] = Math.random() * particleSize + 0.2;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create shader material for particles with blur effect
    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
          if (distanceFromCenter > 0.5) {
            discard;
          }
          
          // Very soft, subtle gradient
          float alpha = 0.5 * (1.0 - smoothstep(0.1, 0.5, distanceFromCenter));
          gl_FragColor = vec4(vColor, alpha * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    // Create points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;
    
    // Create lines material for connections - even more subtle
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    linesMaterialRef.current = linesMaterial;
    
    // Create empty lines geometry
    const linesGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lines);
    linesRef.current = lines;

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Account for scrolling by adding window.scrollY to the calculation
      const scrollOffset = window.scrollY;
      const elementTop = rect.top + scrollOffset;
      
      // Only process mouse events when mouse is within the hero section
      if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation function
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      if (particlesRef.current && cameraRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array;
        const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
        
        // Update raycaster with mouse position
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        
        // Calculate connections between particles
        const connections: number[] = [];
        const particlePositions: THREE.Vector3[] = [];
        
        // Extract particle positions
        for (let i = 0; i < positions.length; i += 3) {
          particlePositions.push(new THREE.Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2]
          ));
        }
        
        // Find particles near mouse
        const mouseRay = raycasterRef.current.ray;
        
        for (let i = 0; i < particleCount; i++) {
          const particlePos = particlePositions[i];
          
          // Update position based on velocity
          positions[i * 3] += velocities[i * 3];
          positions[i * 3 + 1] += velocities[i * 3 + 1];
          positions[i * 3 + 2] += velocities[i * 3 + 2];
          
          // Contain particles within bounds
          if (positions[i * 3] > 25) positions[i * 3] = -25;
          if (positions[i * 3] < -25) positions[i * 3] = 25;
          if (positions[i * 3 + 1] > 25) positions[i * 3 + 1] = -25;
          if (positions[i * 3 + 1] < -25) positions[i * 3 + 1] = 25;
          if (positions[i * 3 + 2] > 10) positions[i * 3 + 2] = -10;
          if (positions[i * 3 + 2] < -10) positions[i * 3 + 2] = 10;
          
          // Check distance to mouse ray
          const distanceToRay = mouseRay.distanceToPoint(particlePos);
          
          // Adjust color based on proximity to mouse
          if (distanceToRay < 5) {
            // Interpolate to hover color
            const t = 1 - distanceToRay / 5;
            colors[i * 3] = baseColor.r * (1 - t) + hoverCol.r * t;
            colors[i * 3 + 1] = baseColor.g * (1 - t) + hoverCol.g * t;
            colors[i * 3 + 2] = baseColor.b * (1 - t) + hoverCol.b * t;
          } else {
            // Gradually return to base color
            colors[i * 3] += (baseColor.r - colors[i * 3]) * 0.05;
            colors[i * 3 + 1] += (baseColor.g - colors[i * 3 + 1]) * 0.05;
            colors[i * 3 + 2] += (baseColor.b - colors[i * 3 + 2]) * 0.05;
          }
          
          // Find connections to other particles - create DNA-like connections
          // Connect mainly to nearby particles in the strand
          const particleIndex = i;
          const isSecondStrand = particleIndex >= particleCount / 2;
          const strandStartIndex = isSecondStrand ? particleCount / 2 : 0;
          const strandEndIndex = isSecondStrand ? particleCount : particleCount / 2;
          
          // Connect to nearby particles in same strand
          for (let j = Math.max(strandStartIndex, i - 3); j < Math.min(strandEndIndex, i + 4); j++) {
            if (i !== j) {
              const distance = particlePos.distanceTo(particlePositions[j]);
              if (distance < connectionDistance / 8) {
                connections.push(
                  positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                  positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                );
              }
            }
          }
          
          // Occasionally connect between strands (like DNA base pairs)
          if (Math.random() < 0.05) {
            const oppositeStrandIndex = isSecondStrand ?
              i - particleCount / 2 : // If in second strand, connect to first
              i + particleCount / 2;  // If in first strand, connect to second
            
            if (oppositeStrandIndex >= 0 && oppositeStrandIndex < particleCount) {
              connections.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[oppositeStrandIndex * 3], positions[oppositeStrandIndex * 3 + 1], positions[oppositeStrandIndex * 3 + 2]
              );
            }
          }
        }
        
        // Update lines geometry
        if (linesRef.current) {
          const linesGeometry = new THREE.BufferGeometry();
          linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3));
          linesRef.current.geometry.dispose();
          linesRef.current.geometry = linesGeometry;
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.geometry.attributes.color.needsUpdate = true;
      }
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
        scene.remove(particlesRef.current);
      }
      
      if (linesRef.current) {
        linesRef.current.geometry.dispose();
        if (linesMaterialRef.current) {
          linesMaterialRef.current.dispose();
        }
        scene.remove(linesRef.current);
      }
      
      rendererRef.current?.dispose();
    };
  }, [color, hoverColor, particleCount, particleSize, connectionDistance]);
  
  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden filter blur-[0.7px] ${className}`}
      aria-hidden="true"
    />
  );
}